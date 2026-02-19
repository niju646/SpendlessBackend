import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentAccount } from './decorators/current-account.decorator';

import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import Role from 'src/common/role.enum';
import { Roles } from './decorators/roles.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  // @Post('login')
  // @UseGuards(LocalAuthGuard)
  // @Public()
  // @HttpCode(HttpStatus.OK)
  // async alumniLogin(@Request() req: { user: User }) {
  //   return this.authService.login(req.user);
  // }

  @Post('admin/login')
  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    return this.authService.googleLogin(idToken);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentAccount() currentUser: User) {
    const user = await this.authService.findUserById(currentUser.id);
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logged out successfully' };
  }

  //password reset driver
  @Post('driver/reset-password')
  @Roles(Role.USER)
  async resetDriverPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetDriverPassword(dto.phone, dto.newPassword);
  }
}
