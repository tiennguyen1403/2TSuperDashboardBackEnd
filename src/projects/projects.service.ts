import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Pagination } from 'src/helpers/decorators/pagination-params.decorator';
import { PaginatedResource } from 'src/helpers/types/paginated-resource';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudResponse } from 'src/helpers/types/response.type';
import { User } from 'src/users/entities/user.entity';

const { CREATED, NO_CONTENT, NOT_FOUND, OK } = HttpStatus;

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<CrudResponse<Project>> {
    let project: Project = new Project();
    project = { ...createProjectDto } as Project;
    const newProject = await this.projectRepository.save(project);

    return {
      item: newProject,
      statusCode: CREATED,
      message: 'Project created successfully!',
    };
  }

  async findAll(
    pagination: Pagination,
  ): Promise<PaginatedResource<Partial<Project>>> {
    const { page, limit, size, offset } = pagination;

    const [projects, total] = await this.projectRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: ['members'],
    });

    return { items: projects, totalItems: total, page, size };
  }

  findOne(id: string) {
    return this.projectRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.projectRepository.findOneBy({ name });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  async remove(id: string): Promise<CrudResponse<null>> {
    await this.projectRepository.delete(id);
    return {
      item: null,
      statusCode: NO_CONTENT,
      message: 'Project was deleted!',
    };
  }

  async addMember(
    projectId: string,
    userId: string,
  ): Promise<CrudResponse<Project>> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });
    if (!project) throw new HttpException('Project not found!', NOT_FOUND);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new HttpException('User not found!', NOT_FOUND);

    project.members.push(user);

    const result = await this.projectRepository.save(project);
    return {
      item: result,
      statusCode: OK,
      message: `Added user (${user.fullName}) to project (${project.name}) successfully!`,
    };
  }
}
