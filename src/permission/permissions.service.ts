
import { ContextService } from '@/common/context/context.service';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  constructor(private context: ContextService) {}

  verifyEntityOwnership(entityBranchId: number): void {
    const userBranches = this.context.getUserBranches();
    if (!userBranches.includes(entityBranchId)) {
      throw new ForbiddenException(`You are not authorized to modify entity with branch id: ${entityBranchId}.`);
    }
  }
}