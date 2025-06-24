import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConsumerSignUpDataDto } from '../dto/consumer.dto';
import { UserRepoistory } from '../repository/user-repository';
import { ConsumerLoginDataDto } from '../dto/consumer-login.dto';

@Injectable()
export class ConsumerService {
  constructor(private readonly userRepository: UserRepoistory) {}

  public async consumerLogin(consumerLoginDataDto: ConsumerLoginDataDto) {
    const password = consumerLoginDataDto.password;
    const email = consumerLoginDataDto.email;
    const userPassword = await this.userRepository.findPassword( password );
    const userEmail = await this.userRepository.findEmail( email );
    if( !userEmail ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if( !userPassword ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return userEmail;
  }

  public async signUp(consumerSignUpData: ConsumerSignUpDataDto) {
    const consumerEmail = consumerSignUpData.email;
    const existingUser = await this.userRepository.findEmail(consumerEmail);
    console.log('testing: ',existingUser);
    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    return await this.userRepository.createConsumer({
      email: consumerSignUpData.email,
      fullName: consumerSignUpData.fullName,
      password: consumerSignUpData.password,
      createdAt: new Date(),
    });
  }
}
