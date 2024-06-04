import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Matches } from 'class-validator';

const passwordRegEx =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
  })
  password: string;
}
