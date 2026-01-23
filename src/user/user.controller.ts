import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //create driver
  @Post('create')
  @Public()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  //update
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}
