export class CreateIngredientDto {
  productName: string;
  ingredient_quantity: number;
  ingredient_unit: string;
}

export class CreateFoodItemDto {
  food_name: string;
  food_description: string;
  food_images: string[];
  food_recipe: string;
  prep_time_minutes: number;
  servings: number;
  cuisine_type: string;
  ingredients: CreateIngredientDto[];
}
