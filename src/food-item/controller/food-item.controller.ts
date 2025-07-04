import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
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

  @Post('admin/create/food-item/bulk')
async createFoodItems(@Body() createDtos: CreateFoodItemDto[]) {
  return this.foodItemService.createFoodItems(createDtos);
}

   @Post( "admin/create/product" )
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.foodItemService.createProduct( createProductDto );
  }

  @Post( "admin/create/product/bulk" )
  createProductBulk(@Body() createProductDto: CreateProductDto[]) {
    return this.foodItemService.createProducts( createProductDto );
  }
  
  @Get('home')
  async getHomeFoodItems() {
    return this.foodItemService.getAllFoodItems();
  }

  @Get('all-products')
  async getAllProducts() {
    return this.foodItemService.findAllProducts();
  }

  @Get('search')
  async searchFoodItems(@Query('q') query: string) {
    return this.foodItemService.searchFoodItems(query);
  }

  @Get(':id')
  async getFoodItemById(@Param('id') id: string) {
    const item = await this.foodItemService.getFoodItemById(id);
    return item;
  }
}
