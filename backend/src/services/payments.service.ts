import prisma from '../models/prisma';
import { PaymentStatus } from '@prisma/client';
import { sendTicketEmail } from '../utils/email';

async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
  const mpesaEnv = process.env.MPESA_ENV || 'sandbox';

  if (!consumerKey || !consumerSecret) {
    console.log('[Mpesa] Missing consumer credentials, returning mock token');
    return 'mock_access_token';
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = mpesaEnv === 'production'
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error('OAuth failed');
    }
    const json = await response.json() as any;
    return json.access_token;
  } catch (error) {
    console.error('Error fetching M-Pesa access token:', error);
    throw error;
  }
}

export class PaymentsService {
  static async initiateMpesaPush(data: any) {
    console.log('[Mpesa] Initiating M-Pesa STK Push for order:', data.orderId);

    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      const error = new Error('Order not found');
      (error as any).status = 404;
      throw error;
    }

    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2cbe9';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://wadu.io/api/payments/mpesa/callback';
    const mpesaEnv = process.env.MPESA_ENV || 'sandbox';

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    let formattedPhone = data.phone.trim().replace(/\+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const accessToken = await getMpesaAccessToken();
    
    if (accessToken === 'mock_access_token') {
      const mockCheckoutId = `mock-checkout-${Date.now()}`;
      const mockMerchantId = `mock-merch-${Date.now()}`;
      
      await prisma.mpesaTransaction.create({
        data: {
          orderId: data.orderId,
          merchantRequestID: mockMerchantId,
          checkoutRequestID: mockCheckoutId,
          phoneNumber: formattedPhone,
          amount: data.amount,
          status: 'PENDING',
        },
      });

      return {
        MerchantRequestID: mockMerchantId,
        CheckoutRequestID: mockCheckoutId,
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing',
      };
    }

    const url = mpesaEnv === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: data.amount,
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: order.id,
          TransactionDesc: 'Ticket Payment',
        }),
      });

      const json = await response.json() as any;

      if (json.ResponseCode === '0') {
        await prisma.mpesaTransaction.create({
          data: {
            orderId: data.orderId,
            merchantRequestID: json.MerchantRequestID,
            checkoutRequestID: json.CheckoutRequestID,
            phoneNumber: formattedPhone,
            amount: data.amount,
            status: 'PENDING',
          },
        });
      }

      return json;
    } catch (error) {
      console.error('M-Pesa STK Push error:', error);
      throw error;
    }
  }

  static async mpesaCallback(payload: any) {
    console.log('[Webhook Callback] M-Pesa webhook callback received:', JSON.stringify(payload));

    let checkoutRequestId = payload.CheckoutRequestID || payload.checkoutRequestId;
    let merchantRequestId = payload.MerchantRequestID || payload.merchantRequestId;
    let resultCode = payload.ResultCode !== undefined ? payload.ResultCode : payload.resultCode;
    let resultDesc = payload.ResultDesc || payload.resultDesc || '';
    let receiptNumber = payload.MpesaReceiptNumber || payload.receiptNumber || '';
    let phoneNumber = payload.PhoneNumber || payload.phoneNumber || '';
    let amount = payload.Amount || payload.amount || 0;

    if (payload.Body?.stkCallback) {
      const cb = payload.Body.stkCallback;
      checkoutRequestId = cb.CheckoutRequestID;
      merchantRequestId = cb.MerchantRequestID;
      resultCode = cb.ResultCode;
      resultDesc = cb.ResultDesc;

      if (cb.CallbackMetadata?.Item) {
        const items = cb.CallbackMetadata.Item as Array<{ Name: string; Value: any }>;
        const amountItem = items.find(i => i.Name === 'Amount');
        const receiptItem = items.find(i => i.Name === 'MpesaReceiptNumber');
        const phoneItem = items.find(i => i.Name === 'PhoneNumber');

        if (amountItem) amount = amountItem.Value;
        if (receiptItem) receiptNumber = receiptItem.Value;
        if (phoneItem) phoneNumber = String(phoneItem.Value);
      }
    }

    if (!checkoutRequestId) {
      const error = new Error('Invalid callback payload: missing CheckoutRequestID');
      (error as any).status = 400;
      throw error;
    }

    const txRecord = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestID: checkoutRequestId },
      include: { order: { include: { event: true, items: true } } },
    });

    if (!txRecord) {
      const orderId = payload.orderId;
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { event: true, items: true },
        });
        if (order) {
          const success = resultCode === 0 || payload.success === true;
          return this.completeOrderPayment(order, success, receiptNumber || `MPESA-${Date.now()}`);
        }
      }
      const error = new Error('Transaction record not found for checkout ID: ' + checkoutRequestId);
      (error as any).status = 404;
      throw error;
    }

    const success = resultCode === 0;
    
    await prisma.mpesaTransaction.update({
      where: { checkoutRequestID: checkoutRequestId },
      data: {
        resultCode,
        resultDesc,
        transactionId: receiptNumber || null,
        phoneNumber: phoneNumber ? String(phoneNumber) : txRecord.phoneNumber,
        status: success ? 'SUCCESS' : 'FAILED',
      },
    });

    return this.completeOrderPayment(txRecord.order, success, receiptNumber || `MPESA-${checkoutRequestId}`);
  }

  static async queryMpesaStatus(orderId: string) {
    const txRecord = await prisma.mpesaTransaction.findUnique({
      where: { orderId },
      include: { order: { include: { event: true, items: true } } },
    });

    if (!txRecord) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { event: true, items: true },
      });
      if (order) {
        return { status: order.paymentStatus, order };
      }
      const error = new Error('Transaction not found');
      (error as any).status = 404;
      throw error;
    }

    if (txRecord.status !== 'PENDING') {
      return { status: txRecord.status, order: txRecord.order };
    }

    const accessToken = await getMpesaAccessToken();
    if (accessToken === 'mock_access_token') {
      console.log('[Mpesa] Simulated STK Push query: Auto-resolving pending transaction to SUCCESS');
      
      const receipt = `MPESA-SIM-${Date.now()}`;
      await prisma.mpesaTransaction.update({
        where: { orderId },
        data: {
          resultCode: 0,
          resultDesc: 'Simulated success',
          status: 'SUCCESS',
          transactionId: receipt,
        },
      });

      const result = await this.completeOrderPayment(txRecord.order, true, receipt);
      return { status: 'SUCCESS', order: result.order };
    }

    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2cbe9';
    const mpesaEnv = process.env.MPESA_ENV || 'sandbox';

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const url = mpesaEnv === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: txRecord.checkoutRequestID,
        }),
      });

      const json = await response.json() as any;
      
      if (json.ResponseCode === '0') {
        const success = json.ResultCode === '0' || json.ResultCode === 0;
        
        await prisma.mpesaTransaction.update({
          where: { orderId },
          data: {
            resultCode: Number(json.ResultCode),
            resultDesc: json.ResultDesc,
            status: success ? 'SUCCESS' : 'FAILED',
          },
        });

        const result = await this.completeOrderPayment(
          txRecord.order,
          success,
          json.ResultDesc?.includes('Receipt') ? json.ResultDesc : `MPESA-${txRecord.checkoutRequestID}`
        );
        return { status: success ? 'SUCCESS' : 'FAILED', order: result.order };
      }

      return { status: 'PENDING', order: txRecord.order };
    } catch (error) {
      console.error('M-Pesa STK Push query error:', error);
      return { status: 'PENDING', order: txRecord.order };
    }
  }

  static async completeOrderPayment(order: any, success: boolean, paymentRef: string) {
    if (order.paymentStatus !== PaymentStatus.PENDING) {
      return { message: 'Order status already updated', order };
    }

    const updatedStatus = success ? PaymentStatus.PAID : PaymentStatus.FAILED;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: updatedStatus,
          paymentRef: success ? paymentRef : null,
        },
      });

      if (updatedStatus === PaymentStatus.PAID) {
        for (const item of order.items) {
          await tx.ticketType.update({
            where: { id: item.ticketTypeId },
            data: {
              sold: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return ord;
    });

    if (updatedStatus === PaymentStatus.PAID) {
      const orderDetails = {
        firstName: order.firstName,
        lastName: order.lastName,
        eventTitle: order.event.title,
        orderId: order.id,
        total: order.total,
      };

      if (order.deliveryMethod === 'EMAIL' || order.deliveryMethod === 'BOTH') {
        sendTicketEmail(order.email, orderDetails)
          .catch((err: any) => console.error('Email delivery error:', err));
      }

      if (order.deliveryMethod === 'WHATSAPP' || order.deliveryMethod === 'BOTH') {
        const { sendTicketWhatsApp } = require('../utils/whatsapp');
        sendTicketWhatsApp(order.phone, orderDetails)
          .catch((err: any) => console.error('WhatsApp delivery error:', err));
      }
    }

    return { message: `Payment completed: ${updatedStatus}`, order: updatedOrder };
  }

  static async processCardPayment(data: any) {
    console.log('[Stub] Processing card payment with payload:', data);

    const { orderId } = data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: true,
        items: true,
      },
    });

    if (!order) {
      const error = new Error('Order not found');
      (error as any).status = 404;
      throw error;
    }

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      return { message: 'Order already processed', order };
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paymentRef: `CARD-REF-${Date.now()}`,
        },
      });

      for (const item of order.items) {
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: {
            sold: {
              increment: item.quantity,
            },
          },
        });
      }

      return ord;
    });

    const orderDetails = {
      firstName: order.firstName,
      lastName: order.lastName,
      eventTitle: order.event.title,
      orderId: order.id,
      total: order.total,
    };

    if (order.deliveryMethod === 'EMAIL' || order.deliveryMethod === 'BOTH') {
      setTimeout(() => {
        sendTicketEmail(order.email, orderDetails)
          .catch((err: any) => console.error('Email error:', err));
      }, 0);
    }

    if (order.deliveryMethod === 'WHATSAPP' || order.deliveryMethod === 'BOTH') {
      const { sendTicketWhatsApp } = require('../utils/whatsapp');
      sendTicketWhatsApp(order.phone, orderDetails)
        .catch((err: any) => console.error('WhatsApp error:', err));
    }

    return { success: true, message: 'Card payment processed successfully', order: updatedOrder };
  }
}
