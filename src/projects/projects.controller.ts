import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  PaginationParams,
} from 'src/helpers/decorators/pagination-params.decorator';
import { validate } from 'class-validator';

const { CREATED, OK, NO_CONTENT, CONFLICT, BAD_REQUEST } = HttpStatus;

@UseGuards(AuthGuard)
@Controller('projects')
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(CREATED)
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const { name } = createProjectDto;
    const existingProject = await this.projectsService.findOneByName(name);

    if (existingProject) {
      const message = 'Project with this name already exists!';
      throw new HttpException(message, CONFLICT);
    }

    validate(createProjectDto).then((errors) => {
      if (errors.length > 0) throw new HttpException(errors[0], BAD_REQUEST);
    });

    return this.projectsService.create(createProjectDto);
  }

  @HttpCode(OK)
  @Get()
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAll(@PaginationParams() paginationParams: Pagination) {
    return this.projectsService.findAll(paginationParams);
  }

  @HttpCode(OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @HttpCode(NO_CONTENT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @HttpCode(NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
