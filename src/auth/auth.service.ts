import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { TokenType } from 'src/auth/enum/tokenType.enum';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';

import { LoginResponse } from 'src/auth/interfaces/login-response.interface';
import { User } from 'src/user/entity/user.entity';
import { Person } from 'src/user/entity/person.entity';
import admin from 'src/firebase/firebase-admin';
import Role from 'src/common/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Person)
    private readonly driverRepo: Repository<Person>,

    private readonly jwtService: JwtService,
  ) {}

  //login for admin
  async validateAdmin(phone: string, password: string): Promise<User | null> {
    const user = await this.validateUser(phone, password);

    if (!user) return null;

    if (!user.isActive) {
      throw new UnauthorizedException('Your account is disabled.');
    }

    return user;
  }

  async validateUser(phone: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { phone },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
    }

    // Return user without password
    const { password: _, ...result } = user;
    return result as User;
  }

  async login(user: User): Promise<LoginResponse> {
    const accessTokenPayload = this.generateAccessTokenPayload(user);
    const refreshTokenPayload = this.generateRefreshTokenPayload(user);

    const accessToken = this.jwtService.sign(accessTokenPayload);
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });

    // Attempt to fetch driver profile if it exists (for the response)
    const driverProfile = await this.driverRepo.findOne({
      where: { user: { id: user.id } },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        type: user.role,
      },
    };
  }

  //google login
  async googleLogin(idToken: string): Promise<LoginResponse> {
    try {
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const email = decodedToken.email;
      const name = decodedToken.name;

      if (!email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      //Check if user exists (use email instead of phone)
      let user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        user = this.userRepository.create({
          email: email,
          name: name,
          password: '',
          role: Role.USER,
          isActive: true,
        });

        await this.userRepository.save(user);
      }

      //Generate your JWT
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.tokenType !== TokenType.REFRESH) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.findUserById(decoded.sub);

      const accessTokenPayload = this.generateAccessTokenPayload(user);
      const refreshTokenPayload = this.generateRefreshTokenPayload(user);

      const newAccessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn: '15m', // Short lived access token
      });

      const newRefreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d', // Rotated refresh token
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  private generateAccessTokenPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      phone: user.phone,
      username: user.name,
      role: user.role,
      tokenType: TokenType.ACCESS,
    };
  }

  private generateRefreshTokenPayload(user: User): Partial<JwtPayload> {
    return {
      sub: user.id,
      tokenType: TokenType.REFRESH,
    };
  }

  //reseting password for driver
  async resetDriverPassword(
    phone: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'user') {
      throw new UnauthorizedException(
        'Password reset is only allowed for driver',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Driver account is not yet approved');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return {
      message: 'Password reset successfully',
    };
  }
}
