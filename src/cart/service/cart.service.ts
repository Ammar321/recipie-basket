import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { FoodItemEntity } from '../../food-item/entities/food-item.entity';
import { User } from '../../user/entities/user-entity';
import { AddToCartDto, UpdateCartItemDto } from '../dto/cart.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(FoodItemEntity)
    private readonly foodItemRepo: Repository<FoodItemEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const foodItem = await this.foodItemRepo.findOneBy({ id: addToCartDto.foodItemId });
    if (!foodItem) {
      throw new NotFoundException('Food item not found');
    }

    // Check if item already exists in cart
    const existingCartItem = await this.cartRepo.findOne({
      where: {
        user: { id: userId },
        foodItem: { id: addToCartDto.foodItemId }
      }
    });

    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += addToCartDto.quantity;
      const updatedCartItem = await this.cartRepo.save(existingCartItem);
      return plainToInstance(CartEntity, updatedCartItem, { excludeExtraneousValues: true });
    }

    // Create new cart item
    const cartItem = this.cartRepo.create({
      user,
      foodItem,
      quantity: addToCartDto.quantity
    });

    const savedCartItem = await this.cartRepo.save(cartItem);
    return plainToInstance(CartEntity, savedCartItem, { excludeExtraneousValues: true });
  }

  async updateCartItem(userId: string, cartItemId: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartRepo.findOne({
      where: {
        id: cartItemId,
        user: { id: userId }
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    const updatedCartItem = await this.cartRepo.save(cartItem);
    return plainToInstance(CartEntity, updatedCartItem, { excludeExtraneousValues: true });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await this.cartRepo.findOne({
      where: {
        id: cartItemId,
        user: { id: userId }
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepo.remove(cartItem);
    return { message: 'Item removed from cart successfully' };
  }

  async getCart(userId: string) {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: userId } },
      relations: ['foodItem'],
      order: { createdAt: 'DESC' }
    });

    return plainToInstance(CartEntity, cartItems, { excludeExtraneousValues: true });
  }

  async clearCart(userId: string) {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: userId } }
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is already empty');
    }

    await this.cartRepo.remove(cartItems);
    return { message: 'Cart cleared successfully' };
  }
} 