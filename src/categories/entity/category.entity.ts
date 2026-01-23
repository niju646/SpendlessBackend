import { Transaction } from 'src/transaction/entity/transaction.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  userId: number;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  category_type: 'income' | 'expense';

  @Column()
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
