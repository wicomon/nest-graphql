import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto';
import { AuthResponse } from './types/auth-response.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enum/valid-roles.enum';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( () => AuthResponse , {name: 'signup'})
  signUp(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse>{
    return this.authService.signup(signupInput);
  }

  @Mutation( () => AuthResponse , {name: 'login'})
  login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse , {name: 'revalidate'})
  @UseGuards( JwtAuthGuard )
  revalidateToken(
    @CurrentUser(/* [ValidRoles.admin] */ ) user: User
  ): AuthResponse{
    // console.log('inside revalidate',user)
    return this.authService.revalidateToken(user);
  }
}
