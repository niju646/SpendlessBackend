import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amount } from './entity/amount.entity';
import { Repository } from 'typeorm';
import { CreateAmountDto } from './dto/create-amount.dto';

@Injectable()
export class AmountService {
  @InjectRepository(Amount)
  private readonly amountRepository: Repository<Amount>;

  async create(dto: CreateAmountDto, userId: number) {
    let userAmount = await this.amountRepository.findOne({
      where: { userId },
    });

    if (userAmount) {
      userAmount.amount += dto.amount;
    } else {
      userAmount = this.amountRepository.create({
        userId,
        amount: dto.amount,
      });
    }

    const savedAmount = await this.amountRepository.save(userAmount);

    return {
      message: 'Amount updated successfully',
      data: savedAmount,
    };
  }

  //get the amount by userid
  async getAmount(userId: number) {
    const amount = await this.amountRepository.findOne({
      where: { userId },
    });

    return {
      message: 'Amount fetched successfully',
      data: amount ?? { amount: 0 },
    };
  }

  // Decrease amount (expense)
  async decreaseAmount(userId: number, value: number) {
    let amount = await this.amountRepository.findOne({
      where: { userId },
    });

    if (!amount) {
      amount = this.amountRepository.create({
        userId,
        amount: 0,
      });
    }

    amount.amount = Number(amount.amount) - Number(value);

    return this.amountRepository.save(amount);
  }

  // Increase amount (income)
  async increaseAmount(userId: number, value: number) {
    let amount = await this.amountRepository.findOne({
      where: { userId },
    });

    if (!amount) {
      amount = this.amountRepository.create({
        userId,
        amount: 0,
      });
    }

    amount.amount = Number(amount.amount) + Number(value);

    return this.amountRepository.save(amount);
  }
}
