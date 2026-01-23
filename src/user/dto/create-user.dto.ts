import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is Required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is Required' })
  phone: string;
}
