import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ReservationCheckoutDto {
  @IsNumber()
  reservationId: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  paymentMethod: string;
}