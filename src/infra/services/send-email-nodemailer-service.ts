import { SendEmail, SendEmailService } from '@/application/services';
import { env } from '@/env';
import { Transporter } from 'nodemailer';
import { transporter } from './email';

export class SendEmailNodemailerService implements SendEmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = transporter;
  }

  async sendEmail(input: SendEmail.Input): Promise<SendEmail.Output> {
    const { to, subject, body } = input;

    await this.transporter.sendMail({
      from: env.GMAIL_USER,
      to,
      subject,
      html: this.baseEmailTemplate(body),
    });
  }

  private baseEmailTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hirable.io</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            color: white;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 400;
          }
          .content {
            padding: 40px 30px;
          }
          .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .footer {
            background: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text {
            color: #718096;
            font-size: 14px;
            margin-bottom: 15px;
          }
          .social-links { margin: 20px 0; }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
          }
          .unsubscribe {
            color: #a0aec0;
            font-size: 12px;
            margin-top: 15px;
          }
          .unsubscribe a {
            color: #667eea;
            text-decoration: none;
          }
          @media only screen and (max-width: 600px) {
            body { padding: 20px 10px; }
            .content { padding: 30px 20px; }
            .message { font-size: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo">Hirable.io</div>
            <div class="tagline">Connecting talents with the best opportunities</div>
          </div>

          <!-- Conteúdo dinâmico -->
          <div class="content">
            ${content}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">© 2025 Hirable.io. All rights reserved.</p>
            <div class="social-links">
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
      </body>
      </html>`;
  }
}