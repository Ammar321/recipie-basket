import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  foodItemId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class RemoveFromCartDto {
  @IsString()
  @IsNotEmpty()
  cartItemId: string;
} 