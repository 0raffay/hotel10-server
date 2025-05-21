import { CreateGuestDto } from "@/guests/dto/create-guest.dto";
import { ReservationStatus } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MinDate, ValidateIf, ValidateNested } from "class-validator";

export class CreateReservationDto {
  @ValidateIf((o) => !o.guest)
  @IsNotEmpty({ message: "Guest ID is required if no guest object is provided" })
  @IsNumber()
  guestId: number;

  @ValidateIf((o) => !o.guestId)
  @IsNotEmpty({ message: "Guest object is required if no guestId is provided" })
  @ValidateNested()
  @IsObject()
  @Type(() => CreateGuestDto)
  guest: CreateGuestDto;

  @IsNumber()
  branchId: number;

  @IsNumber()
  roomId: number;

  @IsNumber()
  totalGuests: number;

  @IsNumber()
  @IsOptional()
  totalChildren: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'checkInDate must be a valid date' })
  checkInDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'checkOutDate must be a valid date' })
  @MinDate(new Date(), { message: 'checkOutDate must be in the future' })
  @IsOptional()
  checkOutDate: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  purpose: string;
}
