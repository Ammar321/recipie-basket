import { Post, Controller, Body, BadRequestException, Get } from '@nestjs/common';
import { ConsumerSignUpDataDto, UserDataDto } from '../dto/consumer.dto';
import { ConsumerService } from '../services/consumer.service';
import { ConsumerLoginDataDto } from '../dto/consumer-login.dto';

@Controller( ['api/consumer'] )
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('login')
  public async consumerLogin(
    @Body() consumerLoginDataDto: ConsumerLoginDataDto ) {
    try {
      return await this.consumerService.consumerLogin( consumerLoginDataDto );
    } catch {
      throw new BadRequestException(
        'Failed to Login. Please check the input data and try again.',
      );
    }
  }

  @Post('sign-up')
  public async consumerSignUp(
    @Body() consumerSignUpDataDto: ConsumerSignUpDataDto ) {
    try {
      return await this.consumerService.signUp(consumerSignUpDataDto);
    } catch {
      throw new BadRequestException(
        'Failed to sign up. Please check the input data and try again.',
      );
    }
  }

   @Post('user-data')
  public async getUserInfo(
    @Body() consumerDataInfo: UserDataDto ) {
    try {
      return await this.consumerService.userInfo( consumerDataInfo );
    } catch {
      throw new BadRequestException(
        'Failed to get user info. Please check the input data and try again.',
      );
    }
  }

  @Get('test') // Temporary test endpoint
  public testEndpoint() {
    return { message: 'Consumer controller test endpoint is working!' };
  }
}
