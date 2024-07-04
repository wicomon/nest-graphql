import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginInput } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // console.log({signupInput})

    // TODO crear usuario
    const user = await this.userService.create(signupInput);

    // todo CREAR JWT
    const token = 'token';

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.userService.findOneByEmail(email);

    if(!bcrypt.compareSync(password, user.password)) throw new BadRequestException('Email/password do not match')

      // TODO genera el jtw
    const token = 'token';
    return {
      token,
      user,
    };
  }

  revalidateToken() {}
}
