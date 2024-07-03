import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( () => String , {name: 'signup'})
  signIn(){
    return this.authService.signup;
  }

  @Mutation( () => String , {name: 'login'})
  login(){
    return this.authService.login;
  }

  @Query(() => String , {name: 'revalidate'})
  revalidateToken(){
    return this.authService.revalidateToken();
  }
}
