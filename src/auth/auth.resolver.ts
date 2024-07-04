import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, AuthResponse, LoginInput } from './dto';

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

  @Query(() => String , {name: 'revalidate'})
  revalidateToken(){
    return this.authService.revalidateToken();
  }
}
