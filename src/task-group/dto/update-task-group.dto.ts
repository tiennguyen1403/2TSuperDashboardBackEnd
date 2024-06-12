import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskGroupDto } from './create-task-group.dto';
import { IsNumber, IsUUID } from 'class-validator';

export class UpdateTaskGroupDto extends PartialType(CreateTaskGroupDto) {
  @ApiProperty()
  @IsUUID(4)
  id: string;

  @ApiProperty()
  order: number;
}
