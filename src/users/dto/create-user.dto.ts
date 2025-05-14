import { UserRole } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  cnic: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNumber()
  branchId: number;

  @IsBoolean()
  @IsOptional()
  isOwner: boolean;

  @IsOptional()
  @IsString()
  address: string;
}
