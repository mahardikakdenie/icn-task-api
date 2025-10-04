/* eslint-disable prettier/prettier */
// src/ai/ai.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(AuthGuard)
  @Get('suggest')
  @HttpCode(HttpStatus.OK)
  async suggestTasks(@Query('context') context: string = 'general work') {
    const suggestions = await this.aiService.generateTaskSuggestions(context);
    return { suggestions };
  }
}
