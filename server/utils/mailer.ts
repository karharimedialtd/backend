import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      logger.warn('Email credentials not configured, skipping email send');
      return false;
    }

    const mailOptions = {
      from: `"Single Audio" <${env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}`, { messageId: result.messageId });
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${options.to}:`, error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  accessRequestReceived: (name: string) => ({
    subject: 'Access Request Received - Single Audio',
    html: `
      <h2>Hello ${name},</h2>
      <p>We've received your access request for Single Audio.</p>
      <p>Our team will review your request and get back to you within 24-48 hours.</p>
      <p>Thank you for your interest in Single Audio!</p>
      <br>
      <p>Best regards,<br>The Single Audio Team</p>
    `
  }),

  accessRequestApproved: (name: string, loginUrl: string) => ({
    subject: 'Welcome to Single Audio - Access Approved!',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Great news! Your access request has been approved.</p>
      <p>You can now log in to your account at: <a href="${loginUrl}">${loginUrl}</a></p>
      <p>Start distributing your music to major platforms today!</p>
      <br>
      <p>Best regards,<br>The Single Audio Team</p>
    `
  }),

  accessRequestRejected: (name: string, reason?: string) => ({
    subject: 'Single Audio Access Request Update',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for your interest in Single Audio.</p>
      <p>Unfortunately, we're unable to approve your access request at this time.</p>
      ${reason ? `<p>Reason: ${reason}</p>` : ''}
      <p>You're welcome to submit a new request in the future.</p>
      <br>
      <p>Best regards,<br>The Single Audio Team</p>
    `
  }),

  payoutApproved: (amount: number, currency: string, method: string) => ({
    subject: 'Payout Approved - Single Audio',
    html: `
      <h2>Payout Approved!</h2>
      <p>Your payout request has been approved:</p>
      <ul>
        <li>Amount: ${currency} ${amount}</li>
        <li>Method: ${method}</li>
      </ul>
      <p>Payment will be processed within 3-5 business days.</p>
      <br>
      <p>Best regards,<br>The Single Audio Team</p>
    `
  }),

  supportTicketReceived: (ticketId: string, subject: string) => ({
    subject: `Support Ticket #${ticketId} - ${subject}`,
    html: `
      <h2>Support Ticket Received</h2>
      <p>We've received your support ticket:</p>
      <ul>
        <li>Ticket ID: #${ticketId}</li>
        <li>Subject: ${subject}</li>
      </ul>
      <p>Our support team will respond within 24 hours.</p>
      <br>
      <p>Best regards,<br>The Single Audio Support Team</p>
    `
  })
};
