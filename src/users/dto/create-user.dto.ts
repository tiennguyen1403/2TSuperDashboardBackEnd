import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegEx = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
// password must contain 1 number (0-9)
// password must contain 1 uppercase letters
// password must contain 1 lowercase letters
// password must contain 1 non-alpha numeric number
// password is 8-16 characters with no space

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
  })
  password: string;
}
