import { IsDefined, IsInt, IsNumber, Min, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ChargeDetails } from "@/payment/dto/charge-details.dto";

export class AssignResourceDto {
  @IsNumber()
  resourceId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @ValidateIf((obj) => !obj.roomId)
  @IsInt()
  reservationId?: number;

  @ValidateIf((obj) => !obj.reservationId)
  @IsInt()
  roomId?: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => ChargeDetails)
  chargeDetails: ChargeDetails
}