import { IsString, IsEnum, IsDateString, IsOptional, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Priority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  assignees: number[];

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  dependencies?: string;
}
