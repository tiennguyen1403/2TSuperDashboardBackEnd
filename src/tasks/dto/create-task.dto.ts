import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { TaskGroup } from 'src/task-group/entities/task-group.entity';
import { User } from 'src/users/entities/user.entity';

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

  @ApiProperty()
  @Type(() => TaskGroup)
  @IsNotEmpty()
  status: TaskGroup;

  @ApiProperty()
  @Type(() => User)
  @IsNotEmpty()
  assignedFor: User;
}
