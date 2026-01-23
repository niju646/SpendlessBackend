import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  //create the category
  async create(dto: CreateCategoryDto, userId: number) {
    const category = this.categoryRepository.create({
      name: dto.name,
      icon: dto.icon,
      color: dto.color,
      category_type: dto.category_type,
      userId: userId,
    });

    const savedCategory = await this.categoryRepository.save(category);

    return {
      message: 'Category created successfully',
      data: savedCategory,
    };
  }

  //get all categories
  async getAll(userId: number, page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'All categories fetched successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
      data: categories,
    };
  }

  //update
  async update(id: number, userId: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.name = dto.name ?? category.name;
    category.color = dto.color ?? category.color;
    category.icon = dto.icon ?? category.icon;

    const updatedCategory = await this.categoryRepository.save(category);

    return {
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  //delete
  async delete(id: number, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);

    return {
      message: 'Category deleted successfully',
    };
  }

  //filter
  async getIncomeCategories(userId: number, page = 1, limit = 10) {
    return this.getByType(userId, 'income', page, limit);
  }
  async getExpenseCategories(userId: number, page = 1, limit = 10) {
    return this.getByType(userId, 'expense', page, limit);
  }
  private async getByType(
    userId: number,
    type: 'income' | 'expense',
    page: number,
    limit: number,
  ) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [categories, total] = await this.categoryRepository.findAndCount({
      where: {
        userId,
        category_type: type, // ✅ FILTER HERE
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      message: `${type} categories fetched successfully`,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
      data: categories,
    };
  }
}
