import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'user_email' })
  @IsNotEmpty()
  email: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'address', default: null })
  @IsString()
  @IsOptional()
  address?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'user_password' })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @Column({ name: 'ph_number', default: null })
  @IsString()
  phNumber: string;

  @Column({ name: 'city', default: null })
  @IsString()
  city: string;
}
