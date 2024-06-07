import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({
    required: false,
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
