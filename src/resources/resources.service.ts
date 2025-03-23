import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { DatabaseService } from '@/common/database/database.service';
import { ICrudService } from '@/common/types';
import { Resource } from '@prisma/client';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';

@Injectable()
export class ResourcesService implements ICrudService<Resource, CreateResourceDto, UpdateResourceDto> {
  constructor(private database: DatabaseService) {}

  async create(createResourceDto: CreateResourceDto, user: any) {
    matchUserBranchWithEntity(user, createResourceDto.branchId);
    return await this.database.resource.create({
      data: createResourceDto
    });
  }

  async update(id: number, updateResourceDto: UpdateResourceDto, user: any) {
    await this.findOne(id, user);
    return this.database.resource.update({
      where: {
        id
      },
      data: updateResourceDto
    });
  }

  async findAll(user: any) {
    return await this.database.resource.findMany({
      where: {
        branchId: user.branchId
      }
    });
  }

  async findOne(id: number, user: any) {
    const record = await this.database.resource.findFirst({
      where: {
        id: id
      }
    });
    if (!record) throw new BadRequestException(`Resource with id ${id} not found`);
    matchUserBranchWithEntity(user, record.branchId);
    return record;
  }

  async remove(id: number, user: any) {
    await this.findOne(id, user);
    return await this.database.resource.delete({
      where: {
        id
      }
    });
  }
}
