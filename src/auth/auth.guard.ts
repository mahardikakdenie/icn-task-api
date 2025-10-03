// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service'; // sesuaikan path
import { Request } from 'express';

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

    const token = authHeader.substring(7); // hapus "Bearer "

    try {
      // Verifikasi JWT dengan Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !data?.user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Opsional: Ambil data profil dari tabel `public.profiles`
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data: profileData, error: profileError } =
        await this.supabaseService
          .getClient()
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

      if (profileError) {
        // Bisa log error, tapi tidak selalu blokir (misal: user baru belum punya profil)
        console.warn('Profile not found for user:', data.user.id);
      }

      // Simpan user & profile ke request untuk digunakan di controller
      request['user'] = data.user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request['profile'] = profileData || null;

      return true;
    } catch (err: any) {
      console.log('any ', err);

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
