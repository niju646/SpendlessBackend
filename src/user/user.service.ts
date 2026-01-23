import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //create the person
  async create(dto: CreateUserDto) {
    const rawPassword =
      dto.phone.length >= 6 ? dto.phone.substring(0, 6) : dto.phone;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const user = await this.userRepo.save({
      name: dto.name,
      phone: dto.phone,
      password: hashedPassword,
      isActive: true,
    });
    const person = this.personRepository.create({
      name: dto.name,
      phone: dto.phone,
      user: user,
    });
    const savedPerson = await this.personRepository.save(person);
    const { user: _, ...rest } = savedPerson;
    return {
      ...rest,
      userId: user.id,
      name: user.name,
      phone: user.phone,
    };
  }

  //update profile
  async update(id: number, dto: UpdateUserDto) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    // update person table
    person.name = dto.name ?? person.name;
    person.phone = dto.phone ?? person.phone;

    // update user table
    person.user.name = dto.name ?? person.user.name;
    person.user.phone = dto.phone ?? person.user.phone;

    await this.userRepo.save(person.user);
    const updatedPerson = await this.personRepository.save(person);

    return {
      message: 'User updated successfully',
      data: {
        ...updatedPerson,
        user: {
          id: updatedPerson.user.id,
          name: updatedPerson.user.name,
          phone: updatedPerson.user.phone,
          isActive: updatedPerson.user.isActive,
        },
      },
    };
  }
}
