import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, phone: string, password: string): Promise<any> {
    const loginDto = plainToInstance(LoginDto, { phone, password });
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap(({ constraints }) =>
        Object.values(constraints!),
      );
      throw new BadRequestException(errorMessages);
    }

    const url = req.originalUrl; // ✅ IMPORTANT
    let account;

    if (url.includes('/admin/login')) {
      account = await this.authService.validateAdmin(phone, password);
    } else {
      account = await this.authService.validateUser(phone, password);
    }

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return account;
  }

  // async validate(email: string, password: string): Promise<any> {
  //   const loginDto = plainToInstance(LoginDto, { email, password });
  //   const errors = await validate(loginDto);

  //   if (errors.length > 0) {
  //     const errorMessages = errors.flatMap(({ constraints }) =>
  //       Object.values(constraints!),
  //     );
  //     throw new BadRequestException(errorMessages);
  //   }

  //   const account = await this.authService.validateUser(email, password);
  //   if (!account) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   if (!account.isActive) {
  //     throw new UnauthorizedException(
  //       'Your account is not yet approved. Please contact the administrator.',
  //     );
  //   }
  //   return account;
  // }
}
