import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepo: BankAccountRepository) {}
  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, initialBalance, color, type } = createBankAccountDto;
    return this.bankAccountsRepo.create({
      data: {
        name,
        initialBalance,
        color,
        type,
        userId,
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.bankAccountsRepo.findAllByUserId({
      where: {
        userId,
      },
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, initialBalance, color, type } = updateBankAccountDto;

    await this.validateOwns(userId, bankAccountId);

    return this.bankAccountsRepo.update({
      where: {
        id: bankAccountId,
      },
      data: {
        name,
        initialBalance,
        color,
        type,
      },
    });
  }

  async delete(userId: string, bankAccountId: string) {
    await this.validateOwns(userId, bankAccountId);

    await this.bankAccountsRepo.delete({
      where: {
        id: bankAccountId,
        userId,
      },
    });

    return null;
  }

  private async validateOwns(userId: string, bankAccountId: string) {
    const isOwner = await this.bankAccountsRepo.findFirst({
      where: {
        id: bankAccountId,
        userId,
      },
    });

    if (!isOwner) {
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
      );
    }
  }
}
