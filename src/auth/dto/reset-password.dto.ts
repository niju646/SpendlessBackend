import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
