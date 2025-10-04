// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Request } from 'express';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Profile } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.substring(7);

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !data?.user) {
        throw new UnauthorizedException('Invalid token');
      }

      // 🔍 Ambil profil — sesuaikan nama kolom!
      const userId = data.user.id.trim(); // ini UUID string

      let profile: Profile | null = null;
      if (userId) {
        const {
          data: profileData,
          error: profileError,
        }: PostgrestSingleResponse<Profile> = await this.supabaseService
          .getClient()
          .from('profiles')
          .select('*')
          .eq('id', data.user.id) // atau .eq('user_id', userId)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Tidak ditemukan — boleh lanjut (misal: user baru)
            console.log(`Profile not found for user: ${data.user.id}`);
            console.log(`Profile not found for user: ${data.user.email}`);
          } else {
            // Error lain → blokir
            console.error('Profile fetch error:', profileError);
            throw new UnauthorizedException('Profile verification failed');
          }
        } else {
          profile = profileData;
        }
      }
      // Simpan ke request
      request['user'] = data.user;
      request['profile'] = profile;

      return true;
    } catch (err) {
      console.error('AuthGuard error:', err);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
