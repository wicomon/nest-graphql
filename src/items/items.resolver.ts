import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, {name: 'intemCreate'})
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
  ) {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll() {
    return await this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string
  ) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('itemUpdate') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item, {name: 'itemRemove'})
  removeItem(@Args('id', { type: () => String }) id: string) {
    return this.itemsService.remove(id);
  }
}
