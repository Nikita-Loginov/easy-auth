import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserGraphqlService {
  constructor (private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany()
  }
}
