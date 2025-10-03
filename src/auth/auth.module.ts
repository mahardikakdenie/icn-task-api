// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service'; // sesuaikan
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [SupabaseService, AuthService],
  exports: [SupabaseService],
})
export class AuthModule {}
