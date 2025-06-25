import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

class Mailer {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      logger.warn('SMTP credentials not provided. Email functionality disabled.');
      return;
    }

    this.transporter = nodemailer.createTransporter({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }

  async sendAccessApprovedEmail(email: string, tempPassword: string) {
    if (!this.transporter) {
      logger.warn('Email transporter not configured');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: env.FROM_EMAIL,
        to: email,
        subject: 'Single Audio - Access Approved',
        html: `
          <h1>Welcome to Single Audio</h1>
          <p>Your access request has been approved!</p>
          <p>You can now log in with:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          <p>Please change your password after first login.</p>
        `
      });
      return true;
    } catch (error) {
      logger.error('Failed to send access approved email:', error);
      return false;
    }
  }

  async sendPayoutApprovedEmail(email: string, amount: number, currency: string) {
    if (!this.transporter) {
      logger.warn('Email transporter not configured');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: env.FROM_EMAIL,
        to: email,
        subject: 'Single Audio - Payout Approved',
        html: `
          <h1>Payout Approved</h1>
          <p>Your payout request has been approved and processed.</p>
          <p><strong>Amount:</strong> ${amount} ${currency}</p>
          <p>You should receive the payment within 3-5 business days.</p>
        `
      });
      return true;
    } catch (error) {
      logger.error('Failed to send payout approved email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    if (!this.transporter) {
      logger.warn('Email transporter not configured');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: env.FROM_EMAIL,
        to: email,
        subject: 'Single Audio - Password Reset',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your Single Audio account.</p>
          <p>Your reset token: <strong>${resetToken}</strong></p>
          <p>This token expires in 1 hour.</p>
        `
      });
      return true;
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      return false;
    }
  }
}

export const mailer = new Mailer();