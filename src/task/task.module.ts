import { Module } from '@nestjs/common';
import { TasksController } from './task.controllers';
import { TasksService } from './task.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, SupabaseService, MailerService],
})
export class TaskModule {}
