// src/main.ts
import { config } from 'dotenv'; // ← tambahkan ini
config(); // ← muat .env

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus properti non-DTO
      forbidNonWhitelisted: true, // Tolak properti tidak dikenal
      transform: true, // Transform ke instance class
    }),
  );
  await app.listen(3001);
}
void bootstrap();
