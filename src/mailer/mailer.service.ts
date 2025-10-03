/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// src/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private supabaseService: SupabaseService) {
    // Cek apakah konfigurasi SMTP tersedia
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        secure: process.env.SMTP_PORT === '465', // true untuk port 465
      });
    }
  }

  /**
   * Kirim email notifikasi
   * Jika SMTP tidak tersedia → simpan ke tabel `email_logs`
   */
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    if (this.transporter) {
      // ✅ Kirim via SMTP
      try {
        await this.transporter.sendMail({
          from: `"TaskBoard" <${process.env.SMTP_USER}>`,
          to,
          subject,
          text,
        });
        console.log(`📧 Email terkirim ke ${to}`);
      } catch (error) {
        console.error('❌ Gagal kirim email via SMTP:', error);
        // Fallback ke mock jika SMTP error
        await this.logToDatabase(to, subject, text, error.message);
      }
    } else {
      // 🔁 Mock: simpan ke database
      await this.logToDatabase(to, subject, text, 'SMTP not configured');
    }
  }

  /**
   * Simpan log email ke tabel `email_logs` di Supabase
   */
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
        error, // opsional: catat error jika ada
      });
      console.log(`📝 Email log disimpan untuk ${to}`);
    } catch (dbError) {
      console.error('❌ Gagal simpan ke email_logs:', dbError);
    }
  }
}
