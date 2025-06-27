import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { ProductEntity } from '../../food-item/entities/product.entity';
import { User } from '../../user/entities/user-entity';
import { CreateOrderDto, UpdateOrderStatusDto, UpdateOrderDto, AddOrderItemDto, UpdateOrderItemDto } from '../dto/order.dto';
import { plainToInstance } from 'class-transformer';
import { FoodItemEntity } from 'src/food-item/entities/food-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(FoodItemEntity)
    private readonly foodItemRepo: Repository<ProductEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!createOrderDto.orderItems || createOrderDto.orderItems.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Validate all products exist and calculate total
    let totalAmount = 0;
    const orderItems: OrderItemEntity[] = [];

    for (const itemDto of createOrderDto.orderItems) {
      const foodItem = await this.foodItemRepo.findOneBy({ id: itemDto.foodItemId });
      if (!foodItem) {
        throw new NotFoundException(`Product with ID ${itemDto.foodItemId} not found`);
      }

      const itemTotal = foodItem.price * itemDto.quantity;
      totalAmount += itemTotal;

      const orderItem = this.orderItemRepo.create({
        foodItem,
        quantity: itemDto.quantity,
        unitPrice: foodItem.price,
        totalPrice: itemTotal
      });
      orderItems.push(orderItem);
    }

    // Create order
    const order = this.orderRepo.create({
      user,
      orderNumber: this.generateOrderNumber(),
      status: OrderStatus.PENDING,
      totalAmount,
      deliveryAddress: createOrderDto.deliveryAddress,
      specialInstructions: createOrderDto.specialInstructions,
      orderItems
    });

    const savedOrder = await this.orderRepo.save(order);
    return plainToInstance(OrderEntity, savedOrder, { excludeExtraneousValues: true });
  }

  async updateOrderStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateStatusDto.status;
    const updatedOrder = await this.orderRepo.save(order);
    return plainToInstance(OrderEntity, updatedOrder, { excludeExtraneousValues: true });
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot update order that is not in pending status');
    }

    if (updateOrderDto.deliveryAddress !== undefined) {
      order.deliveryAddress = updateOrderDto.deliveryAddress;
    }
    if (updateOrderDto.specialInstructions !== undefined) {
      order.specialInstructions = updateOrderDto.specialInstructions;
    }

    const updatedOrder = await this.orderRepo.save(order);
    return plainToInstance(OrderEntity, updatedOrder, { excludeExtraneousValues: true });
  }

  async addOrderItem(orderId: string, addOrderItemDto: AddOrderItemDto) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot add items to order that is not in pending status');
    }

    const foodItem = await this.foodItemRepo.findOneBy({ id: addOrderItemDto.foodItemId });
    if (!foodItem) {
      throw new NotFoundException('Product not found');
    }

    const itemTotal = foodItem.price * addOrderItemDto.quantity;
    const orderItem = this.orderItemRepo.create({
      order,
      foodItem,
      quantity: addOrderItemDto.quantity,
      unitPrice: foodItem.price,
      totalPrice: itemTotal
    });

    await this.orderItemRepo.save(orderItem);

    // Update order total
    order.totalAmount += itemTotal;
    await this.orderRepo.save(order);

    return plainToInstance(OrderItemEntity, orderItem, { excludeExtraneousValues: true });
  }

  async updateOrderItem(orderItemId: string, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.orderItemRepo.findOne({
      where: { id: orderItemId },
      relations: ['order']
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    if (orderItem.order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot update items in order that is not in pending status');
    }

    const oldTotal = orderItem.totalPrice;
    orderItem.quantity = updateOrderItemDto.quantity;
    orderItem.totalPrice = orderItem.unitPrice * updateOrderItemDto.quantity;

    await this.orderItemRepo.save(orderItem);

    // Update order total
    const order = orderItem.order;
    order.totalAmount = order.totalAmount - oldTotal + orderItem.totalPrice;
    await this.orderRepo.save(order);

    return plainToInstance(OrderItemEntity, orderItem, { excludeExtraneousValues: true });
  }

  async removeOrderItem(orderItemId: string) {
    const orderItem = await this.orderItemRepo.findOne({
      where: { id: orderItemId },
      relations: ['order']
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    if (orderItem.order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot remove items from order that is not in pending status');
    }

    const order = orderItem.order;
    order.totalAmount -= orderItem.totalPrice;

    await this.orderItemRepo.remove(orderItem);
    await this.orderRepo.save(order);

    return { message: 'Order item removed successfully' };
  }

  async getOrder(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product', 'user']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return plainToInstance(OrderEntity, order, { excludeExtraneousValues: true });
  }

  async getUserOrders(userId: string) {
     return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.foodItem'],
      order: { createdAt: 'DESC' }
    });
  }

  async getAllOrders() {
      return this.orderRepo.find({
      relations: ['orderItems', 'orderItems.foodItem', 'user'],
      order: { createdAt: 'DESC' }
    });
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cannot cancel order that is not in pending status');
    }

    order.status = OrderStatus.CANCELLED;
    const updatedOrder = await this.orderRepo.save(order);
    return plainToInstance(OrderEntity, updatedOrder, { excludeExtraneousValues: true });
  }
} 