import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    categoryId: number;

    note?: string;
    transactionDate: Date;


}
