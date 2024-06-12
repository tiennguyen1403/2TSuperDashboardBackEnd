import { ApiProperty } from '@nestjs/swagger';
import { UpdateTaskGroupDto } from './update-task-group.dto';

export class ReorderTakGroupDto {
  @ApiProperty()
  newTaskGroups: UpdateTaskGroupDto[];
}
