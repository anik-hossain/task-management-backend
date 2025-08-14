import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(['pending', 'in-progress', 'completed'])
  status: string;
}
