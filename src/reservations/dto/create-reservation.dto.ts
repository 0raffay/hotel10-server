import { ReservationStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, MinDate } from "class-validator";

export class CreateReservationDto {
  @IsNumber()
  guestId: number;

  @IsNumber()
  branchId: number;

  @IsNumber()
  roomId: number;

  @IsNumber()
  totalGuests: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'checkInDate must be a valid date' })
  checkInDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'checkOutDate must be a valid date' })
  @MinDate(new Date(), { message: 'checkOutDate must be in the future' })
  checkOutDate: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus
}
