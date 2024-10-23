import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
  
  @Injectable()
  export class validateBankAccountOwnershipService {
    constructor(private readonly bankAccountsRepo: BankAccountRepository) {}
  
    async validate(
      userId: string,
      bankAccountId: string,
    ) {
      const isOwner = await this.bankAccountsRepo.findFirst({
        where: {
          id: bankAccountId,
          userId,
        },
      });
  
      if (!isOwner) {
        throw new NotFoundException(
          'You are not allowed to perform this action',
        );
      }
    }
  }