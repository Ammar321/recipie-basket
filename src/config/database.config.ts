import { registerAs } from "@nestjs/config";
import { FoodIngredientEntity } from "src/food-item/entities/food-ingredients.entity";
import { FoodItemEntity } from "src/food-item/entities/food-item.entity";
import { ProductEntity } from "src/food-item/entities/product.entity";
import { User } from "src/user/entities/user-entity";
import { CartEntity } from "src/cart/entities/cart.entity";
import { OrderEntity } from "src/order/entities/order.entity";
import { OrderItemEntity } from "src/order/entities/order-item.entity";

export default registerAs("database", () => ({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, ProductEntity, FoodIngredientEntity, FoodItemEntity, CartEntity, OrderEntity, OrderItemEntity],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: "migrations",
}));
