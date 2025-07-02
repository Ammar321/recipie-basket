import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Register global ClassSerializerInterceptor to handle @Exclude()
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 👇 Register global ValidationPipe to handle arrays and DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
