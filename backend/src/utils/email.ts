import nodemailer from 'nodemailer';
import { env } from '../config/env';

const cleanSmtpPass = env.SMTP_PASS ? env.SMTP_PASS.replace(/\s+/g, '') : undefined;

const transporter = env.SMTP_HOST.includes('gmail')
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: env.SMTP_USER && cleanSmtpPass ? {
        user: env.SMTP_USER,
        pass: cleanSmtpPass,
      } : undefined,
    })
  : nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER && cleanSmtpPass ? {
        user: env.SMTP_USER,
        pass: cleanSmtpPass,
      } : undefined,
    });

export const sendTicketEmail = async (to: string, orderDetails: any) => {
  // If SMTP is not fully configured, log the ticket sending stub
  if (!env.SMTP_USER || !cleanSmtpPass) {
    console.log(`[Stub] Sending ticket email to ${to}:`, orderDetails);
    return;
  }

  try {
    const ticketNum = orderDetails.ticketNumber || `TKT-${orderDetails.orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

    const htmlContent = `
      <h1>WADU Ticket Confirmation</h1>
      <p>Dear ${orderDetails.firstName} ${orderDetails.lastName},</p>
      <p>Thank you for purchasing tickets for <strong>${orderDetails.eventTitle}</strong>!</p>
      <h3>Order Summary</h3>
      <ul>
        <li>Ticket Number: <strong>${ticketNum}</strong></li>
        <li>Total Price: KES ${orderDetails.total.toLocaleString()}</li>
      </ul>
      <p>We look forward to seeing you at the event!</p>
      <p>Best regards,<br/>WADU Team</p>
    `;

    const from = env.SMTP_USER ? `"WADU Tickets" <${env.SMTP_USER}>` : env.SMTP_FROM;
    await transporter.sendMail({
      from,
      to,
      subject: `Your WADU Tickets for ${orderDetails.eventTitle}`,
      html: htmlContent,
    });
    console.log(`Ticket email sent successfully to ${to}`);
  } catch (error: any) {
    if (env.NODE_ENV !== 'production') {
      console.warn(`\n⚠️  [SMTP Error] Could not send ticket email via Gmail: ${error.message || error}`);
      console.warn(`   Please verify your Google App Password in backend/.env.\n`);
      return;
    }
    console.error('Failed to send ticket email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (to: string, code: string) => {
  // If SMTP is not fully configured, log the verification stub
  if (!env.SMTP_USER || !cleanSmtpPass) {
    console.log(`[Stub] Sending verification email to ${to}: Code = ${code}`);
    return;
  }

  try {
    const htmlContent = `
      <h1>WADU Email Verification</h1>
      <p>Thank you for registering with WADU Event Platform.</p>
      <p>Your email verification code is: <strong>${code}</strong></p>
      <p>Please enter this code on the verification page to activate your account.</p>
      <p>Best regards,<br/>WADU Team</p>
    `;

    const from = env.SMTP_USER ? `"WADU Tickets" <${env.SMTP_USER}>` : env.SMTP_FROM;
    await transporter.sendMail({
      from,
      to,
      subject: `WADU Email Verification Code`,
      html: htmlContent,
    });
    console.log(`Verification email sent successfully to ${to}`);
  } catch (error: any) {
    if (env.NODE_ENV !== 'production') {
      console.warn(`\n⚠️  [SMTP Error] Could not send verification email via Gmail: ${error.message || error}`);
      console.warn(`   Please verify your Google App Password in backend/.env.\n`);
      return;
    }
    console.error('Failed to send verification email:', error);
    throw error;
  }
};
