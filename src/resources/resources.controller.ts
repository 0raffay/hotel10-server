import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ICrudController } from '@/common/types';
import { Resource } from '@prisma/client';

@Controller('resources')
export class ResourcesController implements ICrudController<Resource, CreateResourceDto, UpdateResourceDto> {
  constructor(private readonly resourceService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto, @Req() req: any) {
    return this.resourceService.create(createResourceDto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.resourceService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.resourceService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto, @Req() req: any) {
    return this.resourceService.update(+id, updateResourceDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.resourceService.remove(+id, req.user);
  }
}
