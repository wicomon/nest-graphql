import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, adminUser: User): Promise<Item> {
    const newItem = this.itemsRepository.create({
      ...createItemInput,
      user: adminUser
    });
    // console.log(newItem)
    return await this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find({});
    return items;
  }

  async findOne(id: string): Promise<Item> {
    // console.log({id})
    const item =  await this.itemsRepository.findOneBy({ id });
    if(!item) throw new NotFoundException('Item not found')
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const itemToUpdate = await this.itemsRepository.preload(updateItemInput);
    if(!itemToUpdate) throw new NotFoundException(`Item with id ${id} not found`)
    // const itemToUpdate = await this.findOne(id);    
    // if (name) itemToUpdate.name = name;
    // if (quantity) itemToUpdate.quantity = quantity;
    // if (quantityUnits) itemToUpdate.quantityUnits = quantityUnits;

    return await this.itemsRepository.save(itemToUpdate);
  }

  async remove(id: string): Promise<Item> {
    const itemToRemove = await this.findOne(id);
    // console.log({itemToRemove})
    const removedItem = await this.itemsRepository.remove(itemToRemove);
    // console.log({removedItem})
    return {...removedItem, id};
  }
}
