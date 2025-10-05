// src/tasks/tasks.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: CreateTaskDto, // pertimbangkan ganti nama DTO
    @Request() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user?.id as string;
    if (!taskId) {
      throw new BadRequestException('Task ID is required');
    }

    const updatedTask = await this.tasksService.updateTask(
      taskId,
      userId,
      updateTaskDto,
    );

    return updatedTask;
  }
}
