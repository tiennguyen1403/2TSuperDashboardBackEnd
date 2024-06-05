import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    enum: ProjectStatus,
    default: ProjectStatus.NOT_STARTED,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ required: false })
  @IsString()
  projectImage: string;

  @ApiProperty({ required: false })
  @IsString()
  projectCover: string;

  @ApiProperty({
    required: false,
    description: 'A brief description of the project',
  })
  @IsString()
  description: string;

  @ApiProperty({
    required: false,
    description: 'The start date of the project',
    type: String,
    format: 'date-time',
  })
  @IsDate({ message: 'Start Date must be a Date instance' })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    required: false,
    description: 'The end date of the project',
    type: String,
    format: 'date-time',
  })
  @IsDate({ message: 'Start Date must be a Date instance' })
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  isActive?: boolean;
}
