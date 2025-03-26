import { IsInt, IsNumber, IsOptional, Min, ValidateIf } from "class-validator";

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
}