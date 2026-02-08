import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { isDev } from '@/infra/utils/is-dev.util';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Authorization } from './decorators/authorization.decorator';
import { Authorized } from './decorators/authorized.decorator';
import { User } from 'generated/prisma/client';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiOkResponse({
    description: 'Успешная регистрация',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким email уже существует',
    schema: {
      example: {
        statusCode: 409,
        message: 'Пользователь с таким email уже существует',
      },
    },
  })
  @Post('register')
  async register(@Res() res: Response, @Body() dto: RegisterDto) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    this.setRefreshCookie(res, refreshToken);
    return res.json({ accessToken });
  }

  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiOkResponse({
    description: 'Успешный вход',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный email или пароль',
    schema: {
      example: {
        statusCode: 401,
        message: 'Неверный email или пароль',
      },
    },
  })
  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginDto) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    this.setRefreshCookie(res, refreshToken);
    return res.json({ accessToken });
  }

  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiOkResponse({
    description: 'Успешное обновление токенов',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    this.setRefreshCookie(res, newRefreshToken);
    return res.json({ accessToken });
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({
    status: 204,
    description: 'Куки очищены, выход выполнен',
  })
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token', {
      path: '/api/auth/refresh',
    });

    return res.sendStatus(204);
  }

  @ApiOperation({ summary: 'Получение персональной информации.' })
  @ApiOkResponse({
    description: 'Успешное получение',
    schema: {
      example: {
        id: 'f3a97460-d66b-4eaf-988a-462bab6bc6a9',
        name: 'admin',
      },
    },
  })
  @Authorization()
  @ApiUnauthorizedResponse({
    description: 'Неавторизованный доступ',
    schema: { example: { statusCode: 401, message: 'Unauthorized' } },
  })
  @Get('@me')
  async getProfile(@Authorized() user: User) {
    return user;
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: !isDev(),
      sameSite: isDev() ? 'lax' : 'strict',
      maxAge:
        Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN_SEC')) *
        1000,
      path: '/api/auth/refresh',
    });
  }
}
