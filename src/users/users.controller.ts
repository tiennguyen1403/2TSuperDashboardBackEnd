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
  HttpException,
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
import { validate } from 'class-validator';

const { CREATED, CONFLICT } = HttpStatus;

@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { username } = createUserDto;
    const existingUser = await this.usersService.findOneByUsername(username);

    if (existingUser) {
      const message = 'User with this username already exists';
      throw new HttpException(message, CONFLICT);
    }

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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const { username } = updateUserDto;
    const existingUser = await this.usersService.findOneByUsername(username);

    if (existingUser && existingUser.id !== id) {
      const message = 'Username already exists!';
      throw new HttpException(message, CONFLICT);
    }

    validate(updateUserDto).then((errors) => {
      if (errors.length > 0) throw new HttpException(errors[0], CONFLICT);
    });

    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
