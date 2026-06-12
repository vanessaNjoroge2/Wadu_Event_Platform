import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER && env.SMTP_PASS ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  } : undefined,
});

export const sendTicketEmail = async (to: string, orderDetails: any) => {
  // If SMTP is not fully configured, log the ticket sending stub
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.log(`[Stub] Sending ticket email to ${to}:`, orderDetails);
    return;
  }

  try {
    const htmlContent = `
      <h1>WADU Ticket Confirmation</h1>
      <p>Dear ${orderDetails.firstName} ${orderDetails.lastName},</p>
      <p>Thank you for purchasing tickets for <strong>${orderDetails.eventTitle}</strong>!</p>
      <h3>Order Summary</h3>
      <ul>
        <li>Order ID: ${orderDetails.orderId}</li>
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
  } catch (error) {
    console.error('Failed to send ticket email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (to: string, code: string) => {
  // If SMTP is not fully configured, log the verification stub
  if (!env.SMTP_USER || !env.SMTP_PASS) {
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
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
};
