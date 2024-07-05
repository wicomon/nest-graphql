import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

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

  findAll() {
    return `This action returns all users`;
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

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
  
  private handleDBErrors(error: any): never {
    if( error.code === '23505') throw new BadRequestException(error.detail);
    if( error.code === 'error-user-not-found') throw new BadRequestException(error.detail);
    
    this.logger.error(error)

    throw new InternalServerErrorException('Error en el servicio')
  }
}
