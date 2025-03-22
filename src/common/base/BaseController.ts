import { BadRequestException, Get, Post, Patch, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe, ValidationPipeOptions, Type, ArgumentMetadata } from '@nestjs/common';
import { Role } from '../types';
import { Roles } from '@/auth/decorators';
import { BaseService } from './BaseService';
import { RolesGuard } from '@/auth/guards/roles.guard';

export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: { body?: Type; query?: Type; param?: Type }
  ) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const targetType = this.targetTypes[metadata.type];
    if (!targetType) {
      return super.transform(value, metadata);
    }
    return super.transform(value, { ...metadata, metatype: targetType });
  }
}

export function BaseController<T, C, U>(createDto: Type<C>, updateDto: Type<U>) {
  const createPipe = new AbstractValidationPipe({ whitelist: true, transform: true }, { body: createDto });
  const updatePipe = new AbstractValidationPipe({ whitelist: true, transform: true }, { body: updateDto });

  class CrudController {
    constructor(readonly service: BaseService<T, C, U>) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    @UsePipes(createPipe)
    async create(@Body() data: C) {
      return this.service.create(data);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    @UsePipes(updatePipe)
    async update(@Param('id') id: string, @Body() data: U) {
      return this.service.update(Number(id), data);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    async findOne(@Param('id') id: string) {
      const record = await this.service.findOne(Number(id));
      if (!record) throw new BadRequestException(`Record with ID ${id} not found`);
      return record;
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    async remove(@Param('id') id: string) {
      return this.service.remove(Number(id));
    }
  }

  return CrudController;
}