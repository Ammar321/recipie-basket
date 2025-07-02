import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfig, DatabaseConfig } from "./config/index.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user-module";
import { FoodItemModule } from "./food-item/food-item.module";
import { CartModule } from "./cart/cart.module";
import { OrderModule } from "./order/order.module";
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FoodItemModule,
    CartModule,
    OrderModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
