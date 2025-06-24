import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItemService } from './service/food-item.service';
import { FoodItemController } from './controller/food-item.controller';
import { FoodItemEntity } from './entities/food-item.entity';
import { ProductEntity } from './entities/product.entity';
import { FoodIngredientEntity } from './entities/food-ingredients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItemEntity,ProductEntity,FoodIngredientEntity])],
  controllers: [FoodItemController],
  providers: [FoodItemService],
})
export class FoodItemModule {}
