/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/task/dto/create-task.dto.ts
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  due_date?: string; // format: YYYY-MM-DD

  @IsString()
  @IsOptional()
  priority?: string;

  @IsArray()
  @IsOptional()
  subtasks?: { id: string; title: string; completed: string }[];
}
