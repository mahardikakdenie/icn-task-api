// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateTaskDto } from './task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailerService: MailerService,
  ) {}
  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('taks')
      .select('*');

    if (error) {
      return { error: error.message };
    }

    return { count: data };
  }

  // src/task/task.service.ts
  async createTask(userId: string, dto: CreateTaskDto) {
    const task = await this.supabaseService
      .getClient()
      .from('tasks')
      .insert({ ...dto, user_id: userId });

    // Dapatkan email user
    const { data: profile, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch user email:', error.message);
      throw new Error('User profile not found');
    }

    if (!profile) {
      throw new Error('User profile does not exist');
    }

    // Kirim notifikasi
    await this.mailerService.sendEmail(
      'dikamahar884@gmail.com' as string, // ✅ benar: dari `profile.email`
      '✅ New Task Created',
      `You just created a new task: "${dto.title}"`,
    );

    return {
      code: task.status,
      status: task.statusText,
    };
  }
}
