import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BankAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByUserId(findAllByUserIdDto: Prisma.BankAccountFindManyArgs) {
    return this.prismaService.bankAccount.findMany(findAllByUserIdDto);
  }

  async findFirst(findFirstDto: Prisma.BankAccountFindFirstArgs) {
    return this.prismaService.bankAccount.findFirst(findFirstDto);
  }

  async create(createDto: Prisma.BankAccountCreateArgs) {
    return this.prismaService.bankAccount.create(createDto);
  }

  async update(updateDto: Prisma.BankAccountUpdateArgs) {
    return this.prismaService.bankAccount.update(updateDto);
  }

  async delete(deleteDto: Prisma.BankAccountDeleteArgs) {
    return this.prismaService.bankAccount.delete(deleteDto);
  }
}
