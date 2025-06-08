import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';

class BranchAssignmentDto {
  @IsNumber()
  branchId: number;

  @IsEnum(UserRole)
  role: UserRole;
}

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

  @IsBoolean()
  @IsOptional()
  isOwner: boolean;

  @IsOptional()
  @IsString()
  address: string;

  @ValidateNested({ each: true })
  @Type(() => BranchAssignmentDto)
  @IsNotEmpty()
  branches: BranchAssignmentDto[];
}
