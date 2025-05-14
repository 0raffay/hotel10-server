import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsOptional()
  hotelId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;
}
