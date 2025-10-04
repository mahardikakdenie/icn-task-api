/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/mailer/mailer.service.ts
import { config } from 'dotenv'; // ← tambahkan ini
config(); // ← muat .env
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private supabaseService: SupabaseService) {
    console.log(
      'check ',
      process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS,
    );

    // Cek apakah konfigurasi SMTP tersedia
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        secure: false, // true hanya untuk port 465
      });
    }
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    if (this.transporter) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await this.transporter.sendMail({
          from: `noreply@ensiklotari.id`,
          to,
          subject,
          text,
        });
        console.log(`✅ Email terkirim ke ${to}`);
      } catch (error) {
        console.error('📧 Gagal kirim email:', error);
        // Fallback ke mock jika error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await this.logToDatabase(to, subject, text, error.message);
      }
    } else {
      // 🔁 Mock: simpan ke database
      await this.logToDatabase(to, subject, text, 'SMTP not configured');
    }
  }

  private async logToDatabase(
    to: string,
    subject: string,
    body: string,
    error?: string,
  ): Promise<void> {
    try {
      const supabase = this.supabaseService.getClient();
      await supabase.from('email_logs').insert({
        to,
        subject,
        body,
        error,
      });
    } catch (dbError) {
      console.error('❌ Gagal simpan ke email_logs:', dbError);
    }
  }
}
