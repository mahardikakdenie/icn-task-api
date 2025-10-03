// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './auth.dto';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  // tambahkan field lain sesuai tabel `profiles`
  [key: string]: any;
}

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // 🔐 Login ke Supabase Auth
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email,
          password,
        });

      // ✅ Penanganan error yang aman (tanpa akses .message pada unknown)
      if (error) {
        // error.message aman karena Supabase menjamin error bertipe AuthError
        throw new UnauthorizedException(
          error.message || 'Invalid email or password',
        );
      }

      const { session } = data;
      const user = session.user;

      // 👤 Ambil data profil dari tabel `public.profiles`
      const {
        data: profile,
        error: profileError,
      }: PostgrestSingleResponse<Profile> = await this.supabaseService // PostgrestSingleResponse<Profile>
        .getClient()
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Jika error selain "not found", lempar exception
      if (
        profileError &&
        profileError.code !== 'PGRST116' // PGRST116 = no rows returned
      ) {
        console.error('Profile fetch error:', profileError);
        throw new InternalServerErrorException('Failed to load user profile');
      }

      // ✅ Respons sukses
      return {
        access_token: session.access_token,
        token_type: 'bearer' as const,
        user: {
          id: user.id,
          email: user.email,
          profile: profile || null,
        },
      };
    } catch (err) {
      // Tangani error tak terduga
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      console.error('Login error:', err);
      throw new InternalServerErrorException('Authentication service error');
    }
  }
}
