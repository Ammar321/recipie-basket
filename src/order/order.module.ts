import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ProductEntity } from '../food-item/entities/product.entity';
import { User } from '../user/entities/user-entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {} 