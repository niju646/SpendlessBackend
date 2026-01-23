import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  // @Post('create')
  // async create(@Body() dto: CreateTransactionDto) {
  //     return this.transactionService.create(dto);
  // }
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() dto: CreateTransactionDto,
    @CurrentAccount() user: User,
  ) {
    return this.transactionService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAll(
    @CurrentAccount() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.transactionService.getAll(user.id, page, limit);
  }

  //get all transaction by category id
  @UseGuards(JwtAuthGuard)
  @Get('by-category/:categoryId')
  async getByCategory(
    @CurrentAccount() user: User,
    @Param('categoryId') categoryId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.transactionService.getByCategory(
      user.id,
      Number(categoryId),
      page,
      limit,
    );
  }

  //sum of transaction
  @UseGuards(JwtAuthGuard)
  @Get('by-category/sum/:categoryId')
  async getCategorySum(
    @CurrentAccount() user: User,
    @Param('categoryId') categoryId: number,
  ) {
    return this.transactionService.getCategorySum(user.id, Number(categoryId));
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateTransactionDto) {
    return this.transactionService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(
    @Param('id') id: number,
    @CurrentAccount() user: User,
  ) {
    return this.transactionService.delete(Number(id), user.id);
  }

}
