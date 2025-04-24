import { Module } from '@nestjs/common';
import { ConsumerController } from './controller/consumer.controller';
import { ConsumerService } from './services/consumer.service';
import { UserRepoistory } from './repository/user-repository';
import { User } from './entities/user-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ConsumerController],
  providers: [ConsumerService, UserRepoistory],
})
export class UserModule {}
