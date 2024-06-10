import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CrudResponse, ListResponse } from 'src/helpers/types/response.type';

const { CREATED, NO_CONTENT, OK } = HttpStatus;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<ListResponse<Task>> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      relations: ['status', 'assignedFor'],
    });
    return { items: tasks, totalItem: total, page: 1, size: 10 };
  }

  async findOne(id: string): Promise<CrudResponse<Task>> {
    const task = await this.taskRepository.findOneBy({ id });
    return { item: task, statusCode: OK, message: '' };
  }

  async create(createTaskDto: CreateTaskDto): Promise<CrudResponse<Task>> {
    const newTask = await this.taskRepository.save(createTaskDto);
    return {
      item: newTask,
      statusCode: CREATED,
      message: 'Task was created successfully!',
    };
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<CrudResponse<null>> {
    await this.taskRepository.update(id, updateTaskDto);
    return {
      item: null,
      statusCode: NO_CONTENT,
      message: 'Task was updated successfully!',
    };
  }

  async remove(id: string): Promise<CrudResponse<null>> {
    await this.taskRepository.delete(id);
    return {
      item: null,
      statusCode: NO_CONTENT,
      message: 'Task was deleted successfully!',
    };
  }
}
