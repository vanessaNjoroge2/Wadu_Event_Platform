import prisma from '../models/prisma';
import { PaymentStatus } from '@prisma/client';
import { sendTicketEmail } from '../utils/email';

// In-memory cache for M-Pesa OAuth token
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0; // Epoch timestamp in ms

async function getMpesaAccessToken() {
  const now = Date.now();
  // Check cache (with a 2-minute safety buffer)
  if (cachedToken && now < tokenExpiryTime - 120 * 1000) {
    return cachedToken;
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
  const mpesaEnv = process.env.MPESA_ENV || 'sandbox';

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa Consumer Key or Consumer Secret is missing in configuration.');
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = mpesaEnv === 'production'
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  console.log('[Mpesa Outgoing Request - OAuth]');
  console.log(`URL: ${url}`);
  console.log(`Headers: { "Authorization": "Basic [PROTECTED]" }`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    console.log(`[Mpesa Response - OAuth] Status: ${response.status}`);
    const text = await response.text();
    console.log(`[Mpesa Response - OAuth] Body: ${text}`);

    if (!response.ok) {
      let errorMsg = `Safaricom OAuth failed with status: ${response.status}`;
      try {
        const jsonErr = JSON.parse(text);
        if (jsonErr.errorMessage) {
          errorMsg = `Safaricom OAuth error: ${jsonErr.errorMessage}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }

    const json = JSON.parse(text);
    if (!json.access_token) {
      throw new Error('No access token returned in Safaricom OAuth response');
    }
    
    cachedToken = json.access_token;
    const expiresIn = Number(json.expires_in) || 3599;
    tokenExpiryTime = now + expiresIn * 1000;

    return cachedToken;
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
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://wadu.io/api/payments/mpesa/callback';
    const mpesaEnv = process.env.MPESA_ENV || 'sandbox';

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    let formattedPhone = data.phone.trim().replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const accessToken = await getMpesaAccessToken();

    const url = mpesaEnv === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const payload = {
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
    };

    console.log('[Mpesa Outgoing Request - STK Push]');
    console.log(`URL: ${url}`);
    console.log(`Headers: { "Authorization": "Bearer [PROTECTED]", "Content-Type": "application/json" }`);
    console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log(`[Mpesa Response - STK Push] Status: ${response.status}`);
      const text = await response.text();
      console.log(`[Mpesa Response - STK Push] Body: ${text}`);

      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error(`Safaricom STK Push returned non-JSON response with status ${response.status}: ${text}`);
      }

      if (!response.ok || !json || json.ResponseCode !== '0') {
        const errorMsg = json?.errorMessage || json?.ResponseDescription || 'M-Pesa STK Push rejected by Safaricom';
        const error = new Error(errorMsg);
        (error as any).status = response.status || 400;
        throw error;
      }

      await prisma.mpesaTransaction.upsert({
        where: { orderId: data.orderId },
        update: {
          merchantRequestID: json.MerchantRequestID,
          checkoutRequestID: json.CheckoutRequestID,
          phoneNumber: formattedPhone,
          amount: data.amount,
          status: 'PENDING',
          resultCode: null,
          resultDesc: null,
          transactionId: null,
        },
        create: {
          orderId: data.orderId,
          merchantRequestID: json.MerchantRequestID,
          checkoutRequestID: json.CheckoutRequestID,
          phoneNumber: formattedPhone,
          amount: data.amount,
          status: 'PENDING',
        },
      });

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
    let transactionDate = '';

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
        const dateItem = items.find(i => i.Name === 'TransactionDate');

        if (amountItem) amount = amountItem.Value;
        if (receiptItem) receiptNumber = receiptItem.Value;
        if (phoneItem) phoneNumber = String(phoneItem.Value);
        if (dateItem) transactionDate = String(dateItem.Value);
      }
    }

    console.log('==================================================');
    console.log('[Webhook Callback Detailed Log]');
    console.log(`- CheckoutRequestID: ${checkoutRequestId}`);
    console.log(`- MerchantRequestID: ${merchantRequestId}`);
    console.log(`- ResultCode: ${resultCode}`);
    console.log(`- ResultDesc: ${resultDesc}`);
    console.log(`- MpesaReceiptNumber: ${receiptNumber}`);
    console.log(`- TransactionDate: ${transactionDate}`);
    console.log(`- Amount: ${amount}`);
    console.log(`- PhoneNumber: ${phoneNumber}`);
    console.log('==================================================');

    if (!checkoutRequestId) {
      const error = new Error('Invalid callback payload: missing CheckoutRequestID');
      (error as any).status = 400;
      throw error;
    }

    const txRecord = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestID: checkoutRequestId },
      include: { order: { include: { event: true, items: { include: { ticketType: true } } } } },
    });

    if (!txRecord) {
      const orderId = payload.orderId;
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { event: true, items: { include: { ticketType: true } } },
        });
        if (order) {
          const success = Number(resultCode) === 0 || payload.success === true;
          return this.completeOrderPayment(order, success, receiptNumber || `MPESA-${Date.now()}`);
        }
      }
      const error = new Error('Transaction record not found for checkout ID: ' + checkoutRequestId);
      (error as any).status = 404;
      throw error;
    }

    const success = Number(resultCode) === 0;
    
    await prisma.mpesaTransaction.update({
      where: { checkoutRequestID: checkoutRequestId },
      data: {
        resultCode: Number(resultCode),
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
      include: { order: { include: { event: true, items: { include: { ticketType: true } } } } },
    });

    if (!txRecord) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { event: true, items: { include: { ticketType: true } } },
      });
      if (order) {
        const status = order.paymentStatus === 'PAID' ? 'SUCCESS' : order.paymentStatus;
        return { status, order };
      }
      const error = new Error('Transaction not found');
      (error as any).status = 404;
      throw error;
    }

    if (txRecord.status !== 'PENDING') {
      return { status: txRecord.status, order: txRecord.order };
    }

    try {
      const accessToken = await getMpesaAccessToken();
      const shortcode = process.env.MPESA_SHORTCODE || '174379';
      const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
      const mpesaEnv = process.env.MPESA_ENV || 'sandbox';

      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

      const url = mpesaEnv === 'production'
        ? 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
        : 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: txRecord.checkoutRequestID,
        }),
      });

      console.log(`[Mpesa Response - STK Status Query] Status: ${response.status}`);
      const text = await response.text();
      console.log(`[Mpesa Response - STK Status Query] Body: ${text}`);

      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error(`Safaricom STK Status Query returned non-JSON response: ${text}`);
      }

      if (json.ResponseCode === '0') {
        const resultCodeNum = json.ResultCode !== undefined ? Number(json.ResultCode) : null;

        // ResultCode 0 means STK Push Payment Succeeded in Safaricom Daraja API
        if (resultCodeNum === 0) {
          console.log(`[Mpesa Query] Transaction ${txRecord.checkoutRequestID} SUCCESSFUL! ResultCode: 0`);
          
          await prisma.mpesaTransaction.update({
            where: { orderId },
            data: {
              resultCode: 0,
              resultDesc: json.ResultDesc || 'The service request is processed successfully.',
              status: 'SUCCESS',
            },
          });

          const completed = await this.completeOrderPayment(
            txRecord.order,
            true,
            `MPESA-${txRecord.checkoutRequestID}`
          );

          // Fetch full fresh order with event and items
          const freshOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { event: true, items: { include: { ticketType: true } } },
          });

          return { status: 'SUCCESS', order: freshOrder || completed.order };
        }

        // ResultCode 1032 or 1031 = Explicitly Cancelled by User on phone
        if (resultCodeNum === 1032 || resultCodeNum === 1031) {
          console.log(`[Mpesa Query] Transaction ${txRecord.checkoutRequestID} CANCELLED BY USER (ResultCode: ${resultCodeNum})`);
          
          await prisma.mpesaTransaction.update({
            where: { orderId },
            data: {
              resultCode: resultCodeNum,
              resultDesc: json.ResultDesc,
              status: 'FAILED',
            },
          });

          const completed = await this.completeOrderPayment(txRecord.order, false, `MPESA-${txRecord.checkoutRequestID}`);
          
          const freshOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { event: true, items: { include: { ticketType: true } } },
          });

          return { status: 'FAILED', order: freshOrder || completed.order };
        }

        // For all other codes (1, 103, 1037, etc.), transaction is still PENDING waiting for user PIN input
        console.log(`[Mpesa Query] Transaction ${txRecord.checkoutRequestID} still PENDING. ResultCode: ${resultCodeNum}`);
        return { status: 'PENDING', order: txRecord.order };
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
