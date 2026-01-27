import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AmountService } from 'src/amount/amount.service';
import { Amount } from 'src/amount/entity/amount.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Amount)
    private readonly amountRepository: Repository<Amount>,
    private readonly amountService: AmountService,
  ) {}

  // Create transaction
  async create(dto: CreateTransactionDto, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const userAmount = await this.amountRepository.findOne({
      where: { userId },
    });

    if (!userAmount || Number(userAmount.amount) <= 0) {
      throw new BadRequestException(
        'Insufficient balance. Please add amount first.',
      );
    }

    const transaction = this.transactionRepository.create({
      amount: dto.amount,
      note: dto.note,
      categoryId: dto.categoryId,
      transactionDate: dto.transactionDate,
      userId: userId,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    if (category.category_type === 'expense') {
      await this.amountService.decreaseAmount(userId, dto.amount);
    } else {
      await this.amountService.increaseAmount(userId, dto.amount);
    }

    return {
      message: 'Transaction created successfully',
      data: savedTransaction,
    };
  }

  //Get all transactions with pagination
  async getAll(userId: number, page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { userId },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['category'],
      },
    );

    return {
      message: 'All transactions fetched successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
      data: transactions,
    };
  }

  //get transaction by category id
  // Get transactions by category (current user)
  async getByCategory(
    userId: number,
    categoryId: number,
    page = 1,
    limit = 10,
  ) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: {
          userId,
          categoryId,
        },
        skip,
        take: limit,
        order: { transactionDate: 'DESC' },
        relations: ['category'],
      },
    );

    return {
      message: 'Transactions fetched by category successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
      data: transactions,
    };
  }

  //sum of transaction
  async getCategorySum(userId: number, categoryId: number) {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.categoryId = :categoryId', { categoryId })
      .getRawOne();

    return {
      message: 'Category transaction sum fetched successfully',
      categoryId,
      totalAmount: Number(result.total),
    };
  }

  //Update transaction
  async update(id: number, dto: UpdateTransactionDto) {
    const payment = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Transaction not found');
    }

    payment.amount = dto.amount ?? payment.amount;
    payment.note = dto.note ?? payment.note;
    payment.categoryId = dto.categoryId ?? payment.categoryId;
    payment.transactionDate = dto.transactionDate ?? payment.transactionDate;

    const updatedTransaction = await this.transactionRepository.save(payment);

    return {
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    };
  }

  //Delete transaction
  async delete(id: number, userId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionRepository.remove(transaction);

    return {
      message: 'Transaction deleted successfully',
    };
  }
}
