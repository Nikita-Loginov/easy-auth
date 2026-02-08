import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Res() res: Response, @Body() dto: RegisterDto) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    this.setRefreshCookie(res, refreshToken);
    return res.json({ accessToken });
  }

  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginDto) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    this.setRefreshCookie(res, refreshToken);
    return res.json({ accessToken });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    this.setRefreshCookie(res, newRefreshToken);
    return res.json({ accessToken });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token', {
      path: '/api/auth/refresh',
    });

    return res.sendStatus(204);
  }

  @Authorization()
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
