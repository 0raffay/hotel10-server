import { DamageStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from 'class-validator';

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
  status: DamageStatus
}
