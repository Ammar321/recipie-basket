import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://running-frontend.vercel.app', // React dev server
    credentials: true,              // if you're using cookies or auth headers
  });
  // 👇 Register global ClassSerializerInterceptor to handle @Exclude()
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
