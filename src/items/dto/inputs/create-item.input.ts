import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String, {  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float, {  })
  @Min(0)
  quantity: number;

  @Field(() => String, { nullable: true  })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
