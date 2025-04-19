import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DatabaseService } from '@/common/database/database.service';
import { Payment } from '@prisma/client';
import { ContextService } from '@/common/context/context.service';
import { PermissionsService } from '@/permission/permissions.service';

@Injectable()
export class PaymentService {
  constructor(
    private database: DatabaseService,
    private context: ContextService,
    private permissionsService: PermissionsService
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { amount, tax, additionalCharges } = createPaymentDto;
    const totalAmount = this.getPaymentTotalAmount(amount, additionalCharges, tax);
    return await this.database.payment.create({
      data: { ...createPaymentDto, totalAmount }
    });
  }

  async findAll() {
    return await this.database.payment.findMany({
      where: {
        reservation: {
          branchId: {
            in: this.context.getUserBranches()
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const payment = await this.database.payment.findFirst({
      where: {
        id
      },
      include: {
        reservation: true
      }
    });
    if (!payment) throw new NotFoundException(`Payment not found for id ${id}.`);
    this.permissionsService.verifyEntityOwnership(payment.reservation.branchId);
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(id);
    return await this.database.payment.update({
      where: {
        id
      },
      data: updatePaymentDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.database.payment.delete({
      where: {
        id
      }
    });
  }

  getPaymentTotalAmount(amount: number, additionalCharges: number, tax: number): number {
    let totalAmount = amount + additionalCharges;
    totalAmount = totalAmount + tax * totalAmount;
    return totalAmount;
  }

  async getAllReservationPayments(reservationId: number): Promise<Payment[]> {
    return await this.database.payment.findMany({
      where: {
        reservationId
      }
    });
  }
}
