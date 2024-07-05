import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { ValidRoles } from "src/auth/enum/valid-roles.enum";

@ArgsType()
export class ValidRolesArgs{

  @Field( () => [ValidRoles], {nullable: true, description: 'Valid roles for users'} )
  @IsArray()
  roles: ValidRoles[] = []
}