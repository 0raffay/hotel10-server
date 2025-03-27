import { PartialType } from '@nestjs/mapped-types';
import { CreateDamageDto } from './create-damage.dto';

export class UpdateDamageDto extends PartialType(CreateDamageDto) {}
