import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

type AuthResponse = TokenResponse & {
  user: User;
};

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, NO_CONTENT } = HttpStatus;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { username, password } = signInDto;
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new HttpException('User not found.', NOT_FOUND);
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new HttpException('Incorrect password.', BAD_REQUEST);
    }

    const tokens = await this.getTokens(user.id, user.username);
    return { ...tokens, user };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.create(signUpDto);
      const tokens = await this.getTokens(user.id, user.username);
      return { ...tokens, user };
    } catch (error) {
      throw new HttpException(error.detail, BAD_REQUEST);
    }
  }

  async signOut() {
    return new HttpException('Logged out.', NO_CONTENT);
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    try {
      const userInfo = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const payload = { sub: userInfo.sub, username: userInfo.username };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
      });
      return { refreshToken, accessToken };
    } catch (error) {
      throw new HttpException('Token was expired', UNAUTHORIZED);
    }
  }

  async getTokens(userId: string, username: string): Promise<TokenResponse> {
    const payload = { sub: userId, username };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '24h' }),
      this.jwtService.signAsync(payload, { expiresIn: '15d' }),
    ]);
    return { accessToken, refreshToken };
  }
}
