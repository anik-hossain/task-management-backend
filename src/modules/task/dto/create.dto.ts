import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  title: string;
}