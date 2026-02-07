import {
  ConflictException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ITokens } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<ITokens> {
    const { name, email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });

    return this.generateTokens(newUser.id);
  }

  async login(dto: LoginDto): Promise<ITokens> {
    const { email, password } = dto;

    const exitUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!exitUser) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isValid = await verify(exitUser.password, password);

    if (!isValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.generateTokens(exitUser.id);
  }

  async generateTokens(userId: string): Promise<ITokens> {
    const payload = {
      sub: userId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: Number(
          this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN_SEC'),
        ),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
