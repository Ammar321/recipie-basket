import { Controller, Post, Body, Get, Param, Delete, Put, BadRequestException } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto, UpdateOrderStatusDto, UpdateOrderDto, AddOrderItemDto, UpdateOrderItemDto } from '../dto/order.dto';

@Controller(['api/orders'])
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':userId')
  async createOrder(
    @Param('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto
  ) {
    try {
      return await this.orderService.createOrder(userId, createOrderDto);
    } catch {
      throw new BadRequestException(
        'Failed to create order. Please check the input data and try again.',
      );
    }
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto
  ) {
    try {
      return await this.orderService.updateOrderStatus(orderId, updateStatusDto);
    } catch {
      throw new BadRequestException(
        'Failed to update order status. Please check the input data and try again.',
      );
    }
  }

  @Put(':orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    try {
      return await this.orderService.updateOrder(orderId, updateOrderDto);
    } catch {
      throw new BadRequestException(
        'Failed to update order. Please check the input data and try again.',
      );
    }
  }

  @Post(':orderId/items')
  async addOrderItem(
    @Param('orderId') orderId: string,
    @Body() addOrderItemDto: AddOrderItemDto
  ) {
    try {
      return await this.orderService.addOrderItem(orderId, addOrderItemDto);
    } catch {
      throw new BadRequestException(
        'Failed to add item to order. Please check the input data and try again.',
      );
    }
  }

  @Put('items/:orderItemId')
  async updateOrderItem(
    @Param('orderItemId') orderItemId: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto
  ) {
    try {
      return await this.orderService.updateOrderItem(orderItemId, updateOrderItemDto);
    } catch {
      throw new BadRequestException(
        'Failed to update order item. Please check the input data and try again.',
      );
    }
  }

  @Delete('items/:orderItemId')
  async removeOrderItem(@Param('orderItemId') orderItemId: string) {
    try {
      return await this.orderService.removeOrderItem(orderItemId);
    } catch {
      throw new BadRequestException(
        'Failed to remove order item. Please check the input data and try again.',
      );
    }
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    try {
      return await this.orderService.getOrder(orderId);
    } catch {
      throw new BadRequestException(
        'Failed to get order. Please check the input data and try again.',
      );
    }
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    try {
      return await this.orderService.getUserOrders(userId);
    } catch {
      throw new BadRequestException(
        'Failed to get user orders. Please check the input data and try again.',
      );
    }
  }

  @Get('all')
  async getAllOrders() {
    try {
      return await this.orderService.getAllOrders();
    } catch {
      throw new BadRequestException(
        'Failed to get all orders. Please check the input data and try again.',
      );
    }
  }

  @Put(':orderId/cancel')
  async cancelOrder(@Param('orderId') orderId: string) {
    try {
      return await this.orderService.cancelOrder(orderId);
    } catch {
      throw new BadRequestException(
        'Failed to cancel order. Please check the input data and try again.',
      );
    }
  }
} 