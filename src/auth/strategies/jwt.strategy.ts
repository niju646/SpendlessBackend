import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenType } from 'src/auth/enum/tokenType.enum';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedAccount } from 'src/auth/interfaces/authenticated-account.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET')!,
    });
  }

  validate(payload: JwtPayload): AuthenticatedAccount {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    if (payload.tokenType !== TokenType.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    return {
      id: payload.sub,
      phone: payload.phone,
      role: payload.role,
    };
  }
}
