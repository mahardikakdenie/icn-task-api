// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateTaskDto } from './task.dto';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

@Injectable()
export class TasksService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailerService: MailerService,
  ) {}
  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('tasks')
      .select('*');

    if (error) {
      return { error: error.message };
    }

    return { data: data };
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
      'dikamahar884@gmail.com' as string,
      '✅ New Task Created',
      `You just created a new task: "${dto.title}"`,
    );

    return {
      code: task.status,
      status: task.statusText,
    };
  }

  async updateTask(taskId: string, userId: string, dto: CreateTaskDto) {
    const { data: currentTask }: PostgrestSingleResponse<CreateTaskDto> =
      await this.supabaseService
        .getClient()
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

    const task = await this.supabaseService
      .getClient()
      .from('tasks')
      .update(dto)
      .eq('id', taskId);

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
      'dikamahar884@gmail.com' as string,
      '✅ Updated Task Created',
      `Update Task Successfully With title: "${currentTask?.title ?? ''} to ${dto.title} and status ${dto.status}"`,
    );

    return {
      code: task.status,
      status: task.statusText,
      data: currentTask,
    };
  }
}
