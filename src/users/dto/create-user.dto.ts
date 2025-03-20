import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  branchId: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;
}