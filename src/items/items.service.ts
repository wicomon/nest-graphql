import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>
  ){}

  async create( createItemInput: CreateItemInput ): Promise<Item> {
    const newItem = this.itemsRepository.create( createItemInput )
    // console.log(newItem)
    return await this.itemsRepository.save( newItem );
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find({});
    return items
  }

  async findOne(id: string): Promise<Item>{
    return await this.itemsRepository.findOne({where: {id}})
  }

  async update(id: number, updateItemInput: UpdateItemInput): Promise<Item> {
    return await this.itemsRepository.findOne({where:{id:'12b3'}})
  }

  async remove(id: number) {
    return await this.itemsRepository.findOne({where:{id:'12b3'}})
  }
}
