import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Pagination } from 'src/helpers/decorators/pagination-params.decorator';
import { PaginatedResource } from 'src/helpers/types/paginated-resource';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    let project: Project = new Project();
    project = { ...createProjectDto } as Project;
    return this.projectRepository.save(project);
  }

  async findAll(
    pagination: Pagination,
  ): Promise<PaginatedResource<Partial<Project>>> {
    const { page, limit, size, offset } = pagination;

    const [projects, total] = await this.projectRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return { items: projects, totalItems: total, page, size };
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  findOneByName(name: string) {
    return this.projectRepository.findOneBy({ name });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
