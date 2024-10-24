import {
  Injectable,
} from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { validateBankAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepo: BankAccountRepository,
    private readonly validateBankAccountOwnershipService: validateBankAccountOwnershipService,
  ) {}
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

  async findAllByUserId(userId: string) {
    const bankAccounts = await this.bankAccountsRepo.findAllByUserId({
      where: {
        userId,
      },
      include: {
        transactions: {
          select: {
            type: true,
            value: true,
          },
        },
      },
    });

    return bankAccounts.map((bankAccount) => {
      const totalTransactions = bankAccount.transactions.reduce(
        (acc, transaction) => {
          return (
            acc +
            (transaction.type === 'INCOME'
              ? transaction.value
              : -transaction.value)
          );
        },
        0,
      );

      const currentBalance = bankAccount.initialBalance + totalTransactions;

      return {
        totalTransactions,
        ...bankAccount,
        currentBalance,
      };
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, initialBalance, color, type } = updateBankAccountDto;

    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

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
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    await this.bankAccountsRepo.delete({
      where: {
        id: bankAccountId,
        userId,
      },
    });

    return null;
  }
}
