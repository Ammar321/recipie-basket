import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { FoodItemEntity } from '../../food-item/entities/food-item.entity';
import { User } from '../../user/entities/user-entity';
import { AddToCartDto, UpdateCartItemDto } from '../dto/cart.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';

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

  const foodItem = await this.foodItemRepo.findOne({
    where: { id: addToCartDto.foodItemId },
    relations: ['ingredients', 'ingredients.product'], // Needed for price access
  });

  if (!foodItem) {
    throw new NotFoundException('Food item not found');
  }

  // Step 1: Calculate total unit cost of this food item
  const foodItemUnitCost = foodItem.ingredients.reduce((total, ingredient) => {
    const productPrice = ingredient.product?.price || 0;
    const productQuantity = ingredient.quantity || 0;
    return total + (productPrice * productQuantity);
  }, 0);

  // Step 2: Check if cart item already exists
  const existingCartItem = await this.cartRepo.findOne({
    where: {
      user: { id: userId },
      foodItem: { id: addToCartDto.foodItemId },
    },
    relations: ['foodItem'],
  });

  if (existingCartItem) {
    existingCartItem.quantity += addToCartDto.quantity;
    const updatedCartItem = await this.cartRepo.save(existingCartItem);

    const totalPrice = foodItemUnitCost * updatedCartItem.quantity;

    return {
      ...plainToInstance(CartEntity, updatedCartItem, {
        excludeExtraneousValues: true,
      }),
      foodItem,
      totalPrice,
    };
  }

  // Step 3: Create a new cart item
  const cartItem = this.cartRepo.create({
    user,
    foodItem,
    quantity: addToCartDto.quantity,
  });

  const savedCartItem = await this.cartRepo.save(cartItem);
  const totalPrice = foodItemUnitCost * addToCartDto.quantity;

  return {
    ...plainToInstance(CartEntity, savedCartItem, {
      excludeExtraneousValues: true,
    }),
    foodItem,
    totalPrice,
  };
}

 async updateCartItem(userId: string, cartItemId: string, updateCartItemDto: UpdateCartItemDto) {
  const cartItem = await this.cartRepo.findOne({
    where: {
      id: cartItemId,
      user: { id: userId },
    },
    relations: ['foodItem'],
  });

  if (!cartItem) {
    throw new NotFoundException('Cart item not found');
  }

  cartItem.quantity = updateCartItemDto.quantity;
  const updatedCartItem = await this.cartRepo.save(cartItem);

  const totalPrice = cartItem.foodItem.price * cartItem.quantity;

  return {
    ...plainToInstance(CartEntity, updatedCartItem, { excludeExtraneousValues: true }),
    foodItem: cartItem.foodItem,
    totalPrice,
  };
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
    relations: ['foodItem', 'foodItem.ingredients', 'foodItem.ingredients.product'],
  });

  const result = cartItems.map((item) => {
    const totalPrice = item.foodItem.price * item.quantity;

    return {
      ...item,
      foodItem: item.foodItem,
      totalPrice,
    };
  });

  return instanceToPlain(result);
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