import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { User } from '../../user/entities/user-entity';
import { FoodItemEntity } from '../../food-item/entities/food-item.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => FoodItemEntity)
  foodItem: FoodItemEntity;

  @Column({ name: 'quantity' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 