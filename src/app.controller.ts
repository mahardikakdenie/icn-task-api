// app.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('test-db')
  async testDb() {
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
