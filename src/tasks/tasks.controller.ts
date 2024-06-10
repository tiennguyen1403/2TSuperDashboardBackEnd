import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;

@UseGuards(AuthGuard)
@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const errors = await validate(createTaskDto);
    if (errors.length) throw new HttpException(errors[0], BAD_REQUEST);
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new HttpException('Task not found!', NOT_FOUND);
    const errors = await validate(updateTaskDto);
    if (errors.length) throw new HttpException(errors[0], BAD_REQUEST);
    return this.tasksService.update(id, updateTaskDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new HttpException('Task not found!', NOT_FOUND);
    return this.tasksService.remove(id);
  }
}
