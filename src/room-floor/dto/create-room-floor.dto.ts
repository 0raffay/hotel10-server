import { IsInt, IsString, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomFloorDto {
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'branchId must be a positive integer' })
  branchId: number;

  @IsString()
  @Length(1, 100, { message: 'name must be between 1 and 100 characters' })
  name: string;
}
