import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { validate } from 'class-validator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;

@UseGuards(AuthGuard)
@Controller('task-group')
@ApiTags('Task Groups')
@ApiBearerAuth()
export class TaskGroupController {
  constructor(private readonly taskGroupService: TaskGroupService) {}

  @Get()
  async findAll() {
    return this.taskGroupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskGroupService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskGroupDto: CreateTaskGroupDto) {
    const errors = await validate(createTaskGroupDto);
    if (errors.length) throw new HttpException(errors[0], BAD_REQUEST);
    return this.taskGroupService.create(createTaskGroupDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskGroupDto: UpdateTaskGroupDto,
  ) {
    const taskGroup = await this.taskGroupService.findOne(id);
    if (!taskGroup) throw new HttpException('Task Group not found!', NOT_FOUND);
    const errors = await validate(updateTaskGroupDto);
    if (errors.length) throw new HttpException(errors[0], BAD_REQUEST);
    return this.taskGroupService.update(id, updateTaskGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const taskGroup = await this.taskGroupService.findOne(id);
    if (!taskGroup) throw new HttpException('Task Group not found!', NOT_FOUND);
    return this.taskGroupService.remove(id);
  }
}
