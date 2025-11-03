import { env } from '@/env';
import nodemailer, { Transporter } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASSWORD,
  },
});

export { transporter };