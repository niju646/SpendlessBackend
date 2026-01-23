import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entity/category.entity';
import { Transaction } from './entity/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { User } from 'src/user/entity/user.entity';
import { AmountModule } from 'src/amount/amount.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Transaction, User]), AmountModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
