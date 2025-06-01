import { ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export const transformUserResponse = (user: any) => {
  return {
    ...user,
    hotel: user.branches.at(0).branch.hotel,
    branches: user.branches.map((userBranch: any) => {
      return {
        ...userBranch,
        hotel: undefined
      };
    })
  };
};

// TOOD: find a better approach to use authentication
/* This function basically handles authentication policy for user branch. */
export const matchUserBranchWithEntity = (user: any, entityBranchId: number) => {
  if (user.branchId !== entityBranchId) {
    console.error(`Access Denied Due to:\n User Branch: ${user.branchId}\n Entity Branch: ${entityBranchId}`);
    throw new ForbiddenException('Access Denied: You do not have permission to modify this entity.');
  }
};

export async function generateReservationNumber(db: DatabaseService): Promise<string> {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const rand = (set: string) => set.charAt(Math.floor(Math.random() * set.length));
  const generateFormat = () =>
    `${rand(letters)}${rand(letters)}-${rand(numbers)}${rand(numbers)}${rand(letters)}${rand(numbers)}${rand(numbers)}${rand(letters)}${rand(numbers)}`;

  let number = generateFormat();
  while (await db.reservation.findFirst({ where: { reservationNumber: number } })) {
    number = generateFormat();
  }

  return number;
}
