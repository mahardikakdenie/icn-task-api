import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { AiModule } from './ai/ai.module';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [AuthModule, TaskModule, AiModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
