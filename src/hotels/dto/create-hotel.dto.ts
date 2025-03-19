import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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