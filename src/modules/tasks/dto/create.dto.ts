import { IsString, IsEnum, IsDateString, IsOptional, IsInt, IsArray, ArrayNotEmpty } from 'class-validator';
import { Priority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  assigneeId: number;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  startDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  dependencies?: number[];
}
