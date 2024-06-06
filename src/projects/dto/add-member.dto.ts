import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class AddMemberDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly userId: User['id'];
}
