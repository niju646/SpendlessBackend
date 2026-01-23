import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import Role from 'src/common/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentAccount } from 'src/auth/decorators/current-account.decorator';
import { User } from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post('create')
  @Roles(Role.USER)
  async create(@Body() dto: CreateCategoryDto, @CurrentAccount() user: User) {
    return this.categoriesService.create(dto, user.id);
  }

  @Get('getAll')
  @Roles(Role.USER)
  async getAll(
    @CurrentAccount() user,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.categoriesService.getAll(
      user.id,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Put('update/:id')
  update(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(Number(id), Number(userId), dto);
  }

  // Delete category
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  @Roles(Role.USER)
  delete(@Param('id') id: number, @CurrentAccount() user: User) {
    return this.categoriesService.delete(Number(id), user.id);
  }

  //filter income and expense
  @UseGuards(JwtAuthGuard)
  @Get('income')
  getIncome(
    @CurrentAccount() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.categoriesService.getIncomeCategories(
      user.id,
      page,
      limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('expense')
  getExpense(
    @CurrentAccount() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.categoriesService.getExpenseCategories(
      user.id,
      page,
      limit,
    );
  }

}
