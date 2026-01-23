import { IsNotEmpty, IsString } from 'class-validator';

class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export { RefreshTokenDto };
