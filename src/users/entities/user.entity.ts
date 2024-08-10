import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
@ObjectType()
export class User {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  fullName: string;

  @Field(() => String)
  @Column({unique: true})
  email: string;

  // @Field(() => String)
  @Column()
  password: string;

  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  
  // TODO: Create relations
  @ManyToOne( () => User, (user) => user.updatedBy, {nullable: true, lazy: true})
  @JoinColumn({name: 'updatedBy'})
  @Field( () => User, {nullable: true} )
  updatedBy?: User;

}
