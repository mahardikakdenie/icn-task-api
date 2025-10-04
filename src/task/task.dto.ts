/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/task/dto/create-task.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['Todo', 'In Progress', 'Done'])
  @IsOptional()
  status?: 'Todo' | 'In Progress' | 'Done' = 'Todo';

  @IsString()
  @IsOptional()
  due_date?: string; // format: YYYY-MM-DD
}
