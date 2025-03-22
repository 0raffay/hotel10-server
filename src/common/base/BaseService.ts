import { NotFoundException } from '@nestjs/common';

export class BaseService<T, CreateDto, UpdateDto> {
  constructor(private readonly model: any) {}

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findOne(id: number): Promise<T> {
    const record = await this.model.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Record with id: ${id} not found`);
    return record;
  }

  async create(data: CreateDto): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: number, data: UpdateDto): Promise<T> {
    await this.findOne(id);
    return this.model.update({ where: { id }, data });
  }

  async remove(id: number): Promise<T> {
    await this.findOne(id);
    return this.model.delete({ where: { id } });
  }
}
