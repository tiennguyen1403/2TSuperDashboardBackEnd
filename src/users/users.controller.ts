import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  PaginationParams,
} from 'src/helpers/decorators/pagination-params.decorator';
import {
  Sorting,
  SortingParams,
} from 'src/helpers/decorators/sorting-params.decorator';
import {
  Filtering,
  FilteringParams,
} from 'src/helpers/decorators/filtering-params.decorator';

@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['fullName', 'id', 'email', 'username']) sort?: Sorting,
    @FilteringParams(['fullName', 'id', 'email', 'username'])
    filter?: Filtering,
  ) {
    return this.usersService.findAll(paginationParams, sort, filter);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
