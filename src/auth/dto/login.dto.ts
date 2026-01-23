import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import Role from 'src/common/role.enum';

class LoginDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

class CreateLoginDto {
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  type: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export { LoginDto, CreateLoginDto };
