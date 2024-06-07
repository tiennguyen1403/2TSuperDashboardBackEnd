import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CrudResponse, ListResponse } from 'src/helpers/types/response.type';

const { CREATED, NO_CONTENT } = HttpStatus;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ListResponse<Task>> {
    const [tasks, total] = await this.taskRepository.findAndCount();
    return { items: tasks, totalItem: total, page: 1, size: 10 };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async create(createTaskDto: CreateTaskDto): Promise<CrudResponse<Task>> {
    const newTask = await this.taskRepository.save(createTaskDto);
    return {
      item: newTask,
      statusCode: CREATED,
      message: 'Task was created successfully!',
    };
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
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
