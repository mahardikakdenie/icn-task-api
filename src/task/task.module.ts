import { Module } from '@nestjs/common';
import { TasksController } from './task.controllers';
import { TasksService } from './task.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, SupabaseService],
})
export class TaskModule {}
