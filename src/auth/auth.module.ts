import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
// Ensure this path is correct

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { Person } from 'src/user/entity/person.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([User, Person]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, LocalStrategy, JwtStrategy],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
