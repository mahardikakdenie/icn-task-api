import { Module } from '@nestjs/common';
import { AiController } from './ai.controllers';
import { AiService } from './ai.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [AiController],
  providers: [AiService, SupabaseService],
})
export class AiModule {}
