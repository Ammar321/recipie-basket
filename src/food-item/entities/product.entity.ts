
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsInt } from 'class-validator';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column({ type: 'text', name: 'product_description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column( { name: 'product_price' })
  @IsNumber()
  price: number;

  @Column({ name: 'product_stock' })
  @IsInt()
  stock: number;

  @Column('simple-array', { name: 'product_images' })
  @IsArray()
  images: string[];

  @Column({ name: 'category_id' })
  @IsInt()
  categoryId: number;

  @Column({ name: 'product_brand' })
  @IsString()
  brand: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
