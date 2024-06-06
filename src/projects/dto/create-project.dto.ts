import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    enum: ProjectStatus,
    default: ProjectStatus.NOT_STARTED,
  })
  @IsEnum(ProjectStatus)
  @IsNotEmpty()
  status: ProjectStatus;

  @ApiProperty({ required: false })
  @IsString()
  projectImage: string;

  @ApiProperty({ required: false })
  @IsString()
  projectCover: string;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsDate({ message: 'Start Date must be a Date instance' })
  @ValidateIf((object, value) => value !== null)
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsDate({ message: 'Start Date must be a Date instance' })
  @ValidateIf((object, value) => value !== null)
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  isActive?: boolean;
}
