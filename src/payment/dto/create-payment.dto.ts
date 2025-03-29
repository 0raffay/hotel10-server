import { PaymentType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  reservationId: number;

  @IsNumber()
  @IsOptional()
  relatedEntityId?: number;

  @IsEnum(PaymentType)
  type: PaymentType

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tax: number;

  @IsNumber()
  @Min(0)
  additionalCharges: number;
}
