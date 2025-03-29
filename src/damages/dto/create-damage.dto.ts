import { ChargeDetails } from '@/payment/dto/charge-details.dto';
import { DamageStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf, ValidateNested } from 'class-validator';

export class CreateDamageDto {
  @IsNumber()
  @Min(1)
  damagedQuantity: number;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @ValidateIf((o) => !o.roomResourceId)
  @IsNumber()
  reservationResourceId?: number;

  @ValidateIf((o) => !o.reservationResourceId)
  @IsNumber()
  roomResourceId?: number;

  @IsEnum(DamageStatus)
  status: DamageStatus;

  @IsDefined()
  @ValidateNested()
  @Type(() => ChargeDetails)
  chargeDetails: ChargeDetails;
}
