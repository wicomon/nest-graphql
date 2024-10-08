import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enum/valid-roles.enum';

@Injectable()
export class UsersService {

  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      // console.log(error);
      this.handleDBErrors(error)
    }
  }

  findAll(roles: ValidRoles[]) {
    if(roles.length === 0 ) return this.userRepository.find({
      // ? Not necessary bc we active "lazy" on relationship
      // relations: {
      //   updatedBy: true
      // }
    });

    // Tenemos roles ['admin, 'superUser']
    return this.userRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles)
    .getMany();
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneByOrFail({email})
      return user;
      
    } catch (error) {
      this.handleDBErrors(error)
    }
  }
  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneByOrFail({email})
      return user;
      
    } catch (error) {
      throw new NotFoundException('Email not found')
      // this.handleDBErrors({
      //   code: 'error-user-not-found',
      //   detail: 'No se encontro el usuario'
      // })
    }
  }
  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id});
    } catch (error) {
      throw new NotFoundException(`User with ${id} not found`)
      // this.handleDBErrors({
      //   code: 'error-user-not-found',
      //   detail: 'No se encontro el usuario'
      // })
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, adminUser: User): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput
      });
      // console.log({user})
      user.updatedBy = adminUser;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id)
    userToBlock.isActive = false;
    userToBlock.updatedBy = adminUser;
    return await this.userRepository.save(userToBlock);
  }
  
  private handleDBErrors(error: any): never {
    if( error.code === '23505') throw new BadRequestException(error.detail);
    if( error.code === 'error-user-not-found') throw new BadRequestException(error.detail);
    
    this.logger.error(error)

    throw new InternalServerErrorException('Error en el servicio')
  }
}
