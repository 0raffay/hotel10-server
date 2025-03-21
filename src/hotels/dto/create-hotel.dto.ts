import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  socialLinks?: Record<string, string>;

  @IsOptional()
  @IsString()
  businessCard?: string;

  @IsOptional()
  @IsString()
  letterHead?: string;
}
