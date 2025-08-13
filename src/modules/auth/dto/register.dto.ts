import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole = UserRole.MEMBER; // Default to MEMBER
}