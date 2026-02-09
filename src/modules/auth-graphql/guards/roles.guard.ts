import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'generated/prisma/client';
import { UserRole } from 'generated/prisma/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesCtx = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    if (!rolesCtx) true;

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const user = req.user as User;

    if (!rolesCtx.includes(user.role)) {
      throw new ForbiddenException('У вас недостаочно прав');
    }

    return true;
  }
}
