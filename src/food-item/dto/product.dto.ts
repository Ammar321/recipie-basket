export class CreateProductDto {
  product_title: string;
  product_description: string;
  product_price: number;
  product_stock: number;
  product_images: string[];
  category_id?: number;
  product_brand: string;
}