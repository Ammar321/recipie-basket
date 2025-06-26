export class ConsumerSignUpDataDto {
  createdAt?: Date;
  email: string;
  fullName: string;
  password: string;
  address?: string;
  phNumber?: string;
  city?: string;
}

export class UserDataDto {
  address: string;
  phNumber?: string;
  city: string;
}
