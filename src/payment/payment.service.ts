import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DatabaseService } from '@/common/database/database.service';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';
import { Payment } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(@Inject(REQUEST) private request: Request, private database: DatabaseService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { amount, tax, additionalCharges } = createPaymentDto;
    const totalAmount = this.getPaymentTotalAmount(amount, additionalCharges, tax);
    return await this.database.payment.create({
      data: {...createPaymentDto, totalAmount}
    });
  }

  async findAll() {
    return await this.database.payment.findMany({
      where: {
        reservation: {
          branchId: this.request.user?.branchId
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
    })
    if (!payment) throw new NotFoundException(`Payment not found for id ${id}.`);
    matchUserBranchWithEntity(this.request.user, payment.reservation.branchId);
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(id);
    return await this.database.payment.update({
      where: {
        id
      },
      data: updatePaymentDto
    })
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
    let totalAmount = (amount + additionalCharges)
    totalAmount = totalAmount + (tax * totalAmount);
    return totalAmount;
  }

  async getAllReservationPayments(reservationId: number): Promise<Payment[]> {
    return await this.database.payment.findMany({
      where: {
        reservationId
      }
    })
  }

}
