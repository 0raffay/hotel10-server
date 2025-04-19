import { UserRole } from '@prisma/client';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators';
import { IAuthUser } from '@/common/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as IAuthUser;

    if (!requiredRoles.some(requiredRole => user.branches.map(branch => branch.role).includes(requiredRole))) {
      throw new UnauthorizedException('Insufficient permissions.');
    }

    return true;
  }
}
