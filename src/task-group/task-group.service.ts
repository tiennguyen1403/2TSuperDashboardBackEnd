import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { CrudResponse, ListResponse } from 'src/helpers/types/response.type';
import { TaskGroup } from './entities/task-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const { CREATED, NO_CONTENT, OK } = HttpStatus;

@Injectable()
export class TaskGroupService {
  constructor(
    @InjectRepository(TaskGroup)
    private taskGroupRepository: Repository<TaskGroup>,
  ) {}

  async findAll(): Promise<ListResponse<TaskGroup>> {
    const [taskGroups, total] = await this.taskGroupRepository.findAndCount({
      relations: ['tasks'],
    });
    return { items: taskGroups, totalItem: total, page: 1, size: 10 };
  }

  async findOne(id: string): Promise<CrudResponse<TaskGroup>> {
    const taskGroup = await this.taskGroupRepository.findOneBy({ id });
    return { item: taskGroup, statusCode: OK, message: '' };
  }

  async create(
    createTaskGroupDto: CreateTaskGroupDto,
  ): Promise<CrudResponse<TaskGroup>> {
    const newTaskGroup =
      await this.taskGroupRepository.save(createTaskGroupDto);
    return {
      item: newTaskGroup,
      statusCode: CREATED,
      message: 'Task Group was created successfully!',
    };
  }

  async update(id: string, updateTaskGroupDto: UpdateTaskGroupDto) {
    await this.taskGroupRepository.update(id, updateTaskGroupDto);
    const message = 'Task Group was updated successfully!';
    return { statusCode: NO_CONTENT, message };
  }

  async remove(id: string): Promise<CrudResponse<null>> {
    await this.taskGroupRepository.delete(id);
    return {
      item: null,
      statusCode: NO_CONTENT,
      message: 'Task Group was deleted successfully!',
    };
  }
}
