import { Module } from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { TaskGroupController } from './task-group.controller';
import { TaskGroup } from './entities/task-group.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TaskGroup, Task])],
  controllers: [TaskGroupController],
  providers: [TaskGroupService],
})
export class TaskGroupModule {}
