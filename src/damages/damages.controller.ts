import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DamagesService } from './damages.service';
import { CreateDamageDto } from './dto/create-damage.dto';
import { UpdateDamageDto } from './dto/update-damage.dto';

@Controller('damages')
export class DamagesController {
  constructor(private readonly damagesService: DamagesService) {}

  @Post()
  create(@Body() createDamageDto: CreateDamageDto) {
    return this.damagesService.create(createDamageDto);
  }

  @Get()
  findAll() {
    return this.damagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.damagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDamageDto: UpdateDamageDto) {
    return this.damagesService.update(+id, updateDamageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.damagesService.remove(+id);
  }
}
