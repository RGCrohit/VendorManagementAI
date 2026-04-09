'use server';

import nodemailer from 'nodemailer';
import axios from 'axios';

export async function sendEmail({ 
  to, 
  subject, 
  message, 
  googleToken 
}: { 
  to: string, 
  subject: string, 
  message: string,
  googleToken?: string | null
}) {
  try {
    // 1. If Google Token is present, send directly via Google Gmail API
    // This uses the individual user's logged-in Gmail account
    if (googleToken) {
      console.log('Sending email via Google API for individual user...');
      
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset="UTF-8"',
        '',
        message
      ].join('\n');

      const encodedEmail = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await axios.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        { raw: encodedEmail },
        {
          headers: {
            Authorization: `Bearer ${googleToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        return { success: true, method: 'google_api' };
      }
    }

    // 2. Fallback to Platform SMTP (Service Account) if no token or if API fails
    // This uses the GMAIL_EMAIL and GMAIL_APP_PASSWORD from .env.local
    if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to,
        subject,
        text: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent via SMTP fallback: ' + info.response);
      return { success: true, method: 'smtp' };
    }

    return { success: false, error: 'No email configuration found' };
  } catch (error: any) {
    console.error('Error sending email:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error?.message || error.message || 'Unknown error' 
    };
  }
}
