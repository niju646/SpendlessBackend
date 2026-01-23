import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from './entity/amount.entity';
import { AmountController } from './amount.controller';
import { AmountService } from './amount.service';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amount, User])],
  providers: [AmountService],
  exports: [AmountService],
  controllers: [AmountController],
})
export class AmountModule {}
