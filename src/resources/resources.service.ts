import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { DatabaseService } from '@/common/database/database.service';
import { ICrudService } from '@/common/types';
import { Resource } from '@prisma/client';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ResourcesService implements ICrudService<Resource, CreateResourceDto, UpdateResourceDto> {
  constructor(@Inject(REQUEST) private request: Request, private database: DatabaseService) {}

  async create(createResourceDto: CreateResourceDto) {
    matchUserBranchWithEntity(this.request.user, createResourceDto.branchId);
    return await this.database.resource.create({
      data: createResourceDto
    });
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    await this.findOne(id);
    return this.database.resource.update({
      where: {
        id
      },
      data: updateResourceDto
    });
  }

  async findAll() {
    return await this.database.resource.findMany({
      where: {
        branchId: this.request.user?.branchId
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.resource.findFirst({
      where: {
        id: id
      }
    });
    if (!record) throw new BadRequestException(`Resource with id ${id} not found`);
    matchUserBranchWithEntity(this.request.user, record.branchId);
    return record;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.database.resource.delete({
      where: {
        id
      }
    });
  }
}
