import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'generated/prisma/client';

export const Authorized = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest() as Request;

    const user = req.user;

    return data ? user[data] : user;
  },
);
