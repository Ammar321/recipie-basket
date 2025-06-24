import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';
import { CartEntity } from './entities/cart.entity';
import { FoodItemEntity } from '../food-item/entities/food-item.entity';
import { User } from '../user/entities/user-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, FoodItemEntity, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {} 