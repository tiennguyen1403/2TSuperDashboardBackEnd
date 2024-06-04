import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Pagination } from 'src/helpers/decorators/pagination-params.decorator';
import { PaginatedResource } from 'src/helpers/types/paginated-resource';
import { Sorting } from 'src/helpers/decorators/sorting-params.decorator';
import { getOrder, getWhere } from 'src/helpers/utilities/queries';
import { Filtering } from 'src/helpers/decorators/filtering-params.decorator';

const { NOT_FOUND } = HttpStatus;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    let user: User = new User();

    let hashedPassword = await bcrypt.hash(password, 10);
    user = { ...createUserDto, password: hashedPassword } as User;

    return this.userRepository.save(user);
  }

  async findAll(
    pagination: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<User>>> {
    const where = getWhere(filter);
    const order = getOrder(sort);
    const { page, limit, size, offset } = pagination;
    const [users, total] = await this.userRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });

    return { items: users, totalItems: total, page, size };
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ affected?: number }> {
    let { password } = updateUserDto;
    let user: User = new User();

    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    user = { ...updateUserDto, password: hashedPassword } as User;

    return this.userRepository.update(id, user);
  }

  async remove(id: string): Promise<{ affected?: number }> {
    const existUser = await this.userRepository.findOneBy({ id });

    if (!existUser) {
      throw new HttpException('User not found.', NOT_FOUND);
    }

    return this.userRepository.delete(id);
  }
}
