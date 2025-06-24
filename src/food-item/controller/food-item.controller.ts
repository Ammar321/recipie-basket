import { Controller, Post, Body, Get } from '@nestjs/common';
import { FoodItemService } from '../service/food-item.service';
import { CreateFoodItemDto } from '../dto/food-item.dto';
import { CreateProductDto } from '../dto/product.dto';

@Controller( ['api'] )
export class FoodItemController {
  constructor( private readonly foodItemService: FoodItemService ) {}

  @Post( "admin/create/food-item" )
  async createFoodItem(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemService.createFoodItem( createFoodItemDto );
  }

   @Post( "admin/create/product" )
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.foodItemService.createProduct( createProductDto );
  }
  
  @Get('home')
  async getHomeFoodItems() {
    return this.foodItemService.getAllFoddItems();
  }
}
