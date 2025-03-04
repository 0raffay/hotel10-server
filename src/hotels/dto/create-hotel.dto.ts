import { IsOptional, IsString, IsArray, IsNotEmpty } from "class-validator";

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  socialLinks?: string;

  @IsOptional()
  @IsString()
  businessCard?: string;

  @IsOptional()
  @IsString()
  letterHead?: string;

  @IsOptional()
  @IsArray()
  branches?: number[]; // Expect only IDs

  @IsOptional()
  @IsArray()
  owners?: number[]; // Expect only IDs

  @IsOptional()
  @IsArray()
  staff?: number[]; // Expect only IDs
}
