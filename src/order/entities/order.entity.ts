import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { User } from '../../user/entities/user-entity';
import { OrderItemEntity } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ name: 'order_number', unique: true })
  @IsNotEmpty()
  orderNumber: string;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @Column({ name: 'delivery_address', nullable: true })
  deliveryAddress?: string;

  @Column({ name: 'special_instructions', nullable: true })
  specialInstructions?: string;

  @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, { cascade: true })
  orderItems: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 