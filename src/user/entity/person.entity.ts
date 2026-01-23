import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import Role from 'src/common/role.enum';

@Entity('person')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  trash: boolean;
}
