import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
