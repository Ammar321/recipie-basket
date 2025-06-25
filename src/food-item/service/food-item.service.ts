import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FoodItemEntity } from '../entities/food-item.entity';
import { CreateFoodItemDto } from '../dto/food-item.dto';
import { FoodIngredientEntity } from '../entities/food-ingredients.entity';
import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dto/product.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FoodItemService {
  constructor(
    @InjectRepository(FoodItemEntity)
    private readonly foodItemRepo: Repository<FoodItemEntity>,
    @InjectRepository(FoodIngredientEntity)
    private readonly ingredientRepo: Repository<FoodIngredientEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async createFoodItem(createFoodItemDto: CreateFoodItemDto) {
    // Check if food item with same name already exists
    const existingFoodItem = await this.foodItemRepo.findOne({
      where: { name: createFoodItemDto.food_name }
    });

    if (existingFoodItem) {
      throw new ConflictException(`Food item with name "${createFoodItemDto.food_name}" already exists`);
    }

    const foodItem = this.foodItemRepo.create({
      name: createFoodItemDto.food_name,
      price: createFoodItemDto.food_price,
      description: createFoodItemDto.food_description,
      images: createFoodItemDto.food_images,
      recipe: createFoodItemDto.food_recipe,
      prepTimeInMinutes: createFoodItemDto.prep_time_minutes,
      servings: createFoodItemDto.servings,
      cuisineType: createFoodItemDto.cuisine_type,
    });

    try {
      const savedFoodItem = await this.foodItemRepo.save(foodItem);

      const ingredients = await Promise.all(
        createFoodItemDto.ingredients.map(async (ingredientDto) => {
          const product = await this.productRepo.findOneBy({ title: ingredientDto.productName });
          if (!product) {
            throw new Error(`Product ${ingredientDto.productName} not found`);
          }

          return this.ingredientRepo.save({
            quantity: ingredientDto.ingredient_quantity,
            unit: ingredientDto.ingredient_unit,
            product,
            foodItem: savedFoodItem,
          });
        }),
      );
      savedFoodItem.ingredients = ingredients;

      return plainToInstance(FoodItemEntity, savedFoodItem, { excludeExtraneousValues: true });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException(`Food item with name "${createFoodItemDto.food_name}" already exists`);
      }
      throw error;
    }
  }

  async getAllFoodItems() {
    return this.foodItemRepo.find();
  }

  async createProduct( createProductDto: CreateProductDto ){
    const product = this.productRepo.create({
      title: createProductDto.product_title,
      description: createProductDto.product_description,
      price: createProductDto.product_price,
      stock: createProductDto.product_stock,
      images: createProductDto.product_images,
      categoryId: createProductDto.category_id,
      brand: createProductDto.product_brand,
    })
    return this.productRepo.save( product );
  }

  async findAllProducts() {
    return this.productRepo.find();
  }

  async findOneProduct(id: string) {
    return this.productRepo.findOneBy({ id });
  }

  async searchFoodItems(query: string) {
  return this.foodItemRepo.find({
    where: {
      name: ILike(`%${query}%`),
    },
  });
}
}
