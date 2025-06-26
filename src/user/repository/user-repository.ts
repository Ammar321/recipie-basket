import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user-entity';
import { Repository } from 'typeorm';
import { ConsumerSignUpDataDto, UserDataDto } from '../dto/consumer.dto';
export class UserRepoistory {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createConsumer(consumerSignUpData: ConsumerSignUpDataDto) {
    const consumer = this.userRepository.create(consumerSignUpData);
    return this.userRepository.save(consumer);
  }

  async createConsumerInfo(consumerSignUpData: UserDataDto) {
    const consumer = this.userRepository.create(consumerSignUpData);
    return this.userRepository.save(consumer);
  }

  public async findEmail(email: string) {
    try {
      const user = await this.userRepository.findOne( { where: { email } } );
      return user;
    } catch (error) {
      console.error('Error finding email:', error);
      throw error;
    }
  }

  public async findPassword( password: string ) {
    const userPassword = await this.userRepository.findOne( { where: { password } } );
    return userPassword
  }
}
