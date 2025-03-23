import { ChargeType, ResourceType } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ResourceType)
  type:  ResourceType

  @IsNumber()
  branchId: number;

  @IsNumber()
  @Min(0)
  inventory: number;

  @IsBoolean()
  @IsNotEmpty()
  reusable: boolean;

  @IsNumber()
  @IsOptional()
  defaultCharge?: number;

  @IsEnum(ChargeType)
  chargeType: ChargeType
}