import { Amount } from 'src/amount/entity/amount.entity';
import { Category } from 'src/categories/entity/category.entity';
import Role from 'src/common/role.enum';
import { Transaction } from 'src/transaction/entity/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  phone: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 'user' })
  role: Role;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Amount, (amount) => amount.user)
  amount: Amount[];

  // @Column({ nullable: true, type: "text" })
  // refreshToken: string;
}
