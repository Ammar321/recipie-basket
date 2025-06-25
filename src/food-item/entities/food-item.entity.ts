import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsInt, IsArray, IsNumber } from 'class-validator';
import { FoodIngredientEntity } from './food-ingredients.entity';
import { Exclude } from 'class-transformer';

@Entity('food_item')
export class FoodItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'food_name', unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'text', name: 'food_description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column('simple-array', { name: 'food_images' })
  @IsArray()
  images: string[];

  @Column({ type: 'text', name: 'food_recipe' })
  @IsString()
  recipe: string;

  @Column({ name: 'prep_time_minutes' })
  @IsInt()
  prepTimeInMinutes: number;

  @Column({ name: 'price' })
  @IsNumber()
  price: number;

  @Column({ name: 'servings' })
  @IsInt()
  servings: number;

  @Column({ name: 'cuisine_type' })
  @IsString()
  cuisineType: string;

  @OneToMany(() => FoodIngredientEntity, (fi) => fi.foodItem, { cascade: true })
  @Exclude()
  ingredients: FoodIngredientEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
