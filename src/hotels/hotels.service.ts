import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto) {
    return await this.prisma.hotel.create({
      data: {
        name: createHotelDto.name,
        website: createHotelDto.website,
        socialLinks: createHotelDto.socialLinks ? JSON.parse(createHotelDto.socialLinks) : undefined, // Ensure JSON
        businessCard: createHotelDto.businessCard,
        letterHead: createHotelDto.letterHead,
        branches: {
          connect: createHotelDto.branches?.map(branchId => ({ id: branchId })) || []
        },
        owners: {
          connect: createHotelDto.owners?.map(ownerId => ({ id: ownerId })) || []
        },
        staff: {
          connect: createHotelDto.staff?.map(userId => ({ id: userId })) || []
        }
      }
    });
  }

  async findAll() {
    return await this.prisma.hotel.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.hotel.findUnique({
      where: { id },
      include: { branches: true, owners: true, staff: true }
    });
  }
  async update(id: number, updateHotelDto: UpdateHotelDto) {
    return await this.prisma.hotel.update({
      where: { id },
      data: {
        name: updateHotelDto.name,
        website: updateHotelDto.website,
        socialLinks: updateHotelDto.socialLinks ? JSON.parse(updateHotelDto.socialLinks) : undefined,
        businessCard: updateHotelDto.businessCard,
        letterHead: updateHotelDto.letterHead,
        branches: updateHotelDto.branches ? { set: updateHotelDto.branches.map(branchId => ({ id: branchId })) } : undefined,
        owners: updateHotelDto.owners ? { set: updateHotelDto.owners.map(ownerId => ({ id: ownerId })) } : undefined,
        staff: updateHotelDto.staff ? { set: updateHotelDto.staff.map(userId => ({ id: userId })) } : undefined
      }
    });
  }
  

  async remove(id: number) {
    return await this.prisma.hotel.delete({
      where: { id }
    }) 
  }
}
