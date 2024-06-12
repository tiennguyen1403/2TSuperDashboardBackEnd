import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
