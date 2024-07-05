import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginInput } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // console.log({signupInput})

    const user = await this.userService.create(signupInput);

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.userService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Email/password do not match');

    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      token,
      user
    }
  }

  async validateUser(id: string): Promise<User>{
    const user = await this.userService.findOneById(id);

    if(!user.isActive) throw new UnauthorizedException('User inactive')

    delete user.password;

    return user;
  }
}
