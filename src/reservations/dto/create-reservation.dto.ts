import { ReservationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

// Custom class-level validator to check if checkOutDate > checkInDate
@ValidatorConstraint({ name: 'isCheckOutAfterCheckIn', async: false })
class IsCheckOutAfterCheckInConstraint implements ValidatorConstraintInterface {
  validate(checkOutDate: any, args: ValidationArguments) {
    const object = args.object as any;
    const checkInDate = object.checkInDate;

    if (!checkInDate || !checkOutDate) return true; // Let @IsNotEmpty and @IsDate handle empty/invalid dates
    return new Date(checkOutDate) > new Date(checkInDate);
  }

  defaultMessage(args: ValidationArguments) {
    return `checkOutDate must be after checkInDate`;
  }
}

export class CreateReservationDto {
  @IsNotEmpty({ message: 'Guest ID is required' })
  @IsNumber()
  guestId: number;

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
  @Validate(IsCheckOutAfterCheckInConstraint)
  checkOutDate: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  purpose: string;

  @IsString()
  @IsOptional()
  reference: string;

  @IsNumber()
  @Min(0)
  advancePaymentAmount: number;
}
