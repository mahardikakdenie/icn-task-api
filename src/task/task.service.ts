// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class TasksService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('tasks')
      .select('*', { count: 'exact' });

    if (error) {
      return { error: error.message };
    }

    return { count: data };
  }
}
