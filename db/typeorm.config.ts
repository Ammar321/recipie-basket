import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { User } from "src/user/entities/user-entity";
import { FoodIngredientEntity } from "src/food-item/entities/food-ingredients.entity";
import { FoodItemEntity } from "src/food-item/entities/food-item.entity";
import { ProductEntity } from "src/food-item/entities/product.entity";
import { CartEntity } from "src/cart/entities/cart.entity";
import { OrderEntity } from "src/order/entities/order.entity";
import { OrderItemEntity } from "src/order/entities/order-item.entity";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get("DB_HOST"),
  port: configService.get("DB_PORT"),
  username: configService.get("DB_USERNAME"),
  password: configService.get("DB_PASSWORD"),
  database: configService.get("DB_DATABASE"),
  entities: [User, FoodIngredientEntity, FoodItemEntity, ProductEntity, CartEntity, OrderEntity, OrderItemEntity],
  synchronize: false,
  logging: configService.get("nodenv") === "development",
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: "migrations",
});
