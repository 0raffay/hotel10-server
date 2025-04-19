import { IAuthUser } from '@/common/types';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ContextService {
  constructor(@Inject(REQUEST) private request: Request) {}

  getAuthUser(): IAuthUser {
    return this.request.user as IAuthUser;
  }

  getUserBranches(): number[] {
    return this.getAuthUser().branches.map(branch => branch.id);
  }
}