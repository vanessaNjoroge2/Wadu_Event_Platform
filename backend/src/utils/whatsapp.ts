import { env } from '../config/env';

export const sendTicketWhatsApp = async (to: string, orderDetails: any) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886';

  let formattedTo = to.trim();
  if (!formattedTo.startsWith('whatsapp:')) {
    let cleanNumber = formattedTo.replace(/\+/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '254' + cleanNumber.slice(1);
    } else if (!cleanNumber.startsWith('254')) {
      cleanNumber = '254' + cleanNumber;
    }
    formattedTo = `whatsapp:+${cleanNumber}`;
  }

  const messageBody = `Your WADU Tickets for ${orderDetails.eventTitle}\n` +
    `Dear ${orderDetails.firstName} ${orderDetails.lastName},\n` +
    `Thank you for purchasing tickets!\n` +
    `Order ID: ${orderDetails.orderId}\n` +
    `Total Price: KES ${orderDetails.total.toLocaleString()}\n` +
    `We look forward to seeing you at the event!`;

  if (!accountSid || !authToken) {
    console.log(`[Stub] Sending WhatsApp ticket to ${formattedTo}: ${messageBody}`);
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', formattedTo);
    params.append('Body', messageBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Twilio error: ${errText}`);
    }

    console.log(`WhatsApp ticket sent successfully to ${formattedTo}`);
  } catch (error) {
    console.error('Failed to send WhatsApp ticket:', error);
  }
};
