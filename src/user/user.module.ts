import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Person, User])],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
