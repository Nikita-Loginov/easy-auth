import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { isDev } from '@/infra/utils/is-dev.util';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';

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

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: !isDev(),
      sameSite: isDev() ? 'lax' : 'strict',
      maxAge:
        Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN_SEC')) *
        1000,
    });
  }
}
