import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { FoodItemEntity } from './food-item.entity';
import { ProductEntity } from './product.entity';
import { IsString, IsNumber } from 'class-validator';

@Entity('food_ingredient')
export class FoodIngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FoodItemEntity, (foodItem) => foodItem.ingredients)
  foodItem: FoodItemEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column({ name: 'ingredient_quantity' })
  @IsNumber()
  quantity: number;

  @Column({ name: 'ingredient_unit' })
  @IsString()
  unit: string;
}
