import { IsString, IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => String)
  @IsString()
  @IsUUID()
  id: string;
}
