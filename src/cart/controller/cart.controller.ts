import { Controller, Post, Body, Get, Param, Delete, Put, BadRequestException } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { AddToCartDto, UpdateCartItemDto } from '../dto/cart.dto';

@Controller(['api/cart'])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId')
  async addToCart(
    @Param('userId') userId: string,
    @Body() addToCartDto: AddToCartDto
  ) {
    try {
      return await this.cartService.addToCart(userId, addToCartDto);
    } catch {
      throw new BadRequestException(
        'Failed to add item to cart. Please check the input data and try again.',
      );
    }
  }

  @Put(':userId/:cartItemId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    try {
      return await this.cartService.updateCartItem(userId, cartItemId, updateCartItemDto);
    } catch {
      throw new BadRequestException(
        'Failed to update cart item. Please check the input data and try again.',
      );
    }
  }

  @Delete(':userId/:cartItemId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('cartItemId') cartItemId: string
  ) {
    try {
      return await this.cartService.removeFromCart(userId, cartItemId);
    } catch {
      throw new BadRequestException(
        'Failed to remove item from cart. Please check the input data and try again.',
      );
    }
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    try {
      return await this.cartService.getCart(userId);
    } catch {
      throw new BadRequestException(
        'Failed to get cart items. Please check the input data and try again.',
      );
    }
  }

  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    try {
      return await this.cartService.clearCart(userId);
    } catch {
      throw new BadRequestException(
        'Failed to clear cart. Please check the input data and try again.',
      );
    }
  }
} 