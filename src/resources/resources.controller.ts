import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ICrudController } from '@/common/types';
import { Resource } from '@prisma/client';
import { AssignResourceDto } from './dto/assign-resource.dto';

@Controller('resources')
export class ResourcesController implements ICrudController<Resource, CreateResourceDto, UpdateResourceDto> {
  constructor(private readonly resourceService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.create(createResourceDto);
  }

  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, ) {
    return this.resourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto, ) {
    return this.resourceService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, ) {
    return this.resourceService.remove(+id);
  }

  @Post("assign")
  assignResource(@Body() assignResourceDto: AssignResourceDto) {
    return this.resourceService.assignResource(assignResourceDto);
  }
}
