import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateAmountDto } from './dto/create-amount.dto';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AmountService } from './amount.service';

@Controller('amount')
export class AmountController {
  constructor(private readonly amountService: AmountService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateAmountDto, @CurrentAccount() user: User) {
    return this.amountService.create(dto, user.id);
  }

  //get user amount
  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getAmount(@CurrentAccount() user: User) {
    return this.amountService.getAmount(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset')
  async resetAmount(@CurrentAccount() user: User) {
    return this.amountService.reset(user.id);
  }
}
