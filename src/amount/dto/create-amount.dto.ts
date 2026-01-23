import { IsNumber } from 'class-validator';

export class CreateAmountDto {
  @IsNumber()
  amount: number;
}
