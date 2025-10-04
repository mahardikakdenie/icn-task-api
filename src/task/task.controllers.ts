// src/tasks/tasks.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto } from './task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // console.log("user profile from token : ", req?.user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req?.user.id as string; // ID user dari JWT
    return await this.tasksService.createTask(userId, createTaskDto);
  }
}
