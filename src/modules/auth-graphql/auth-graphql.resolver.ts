import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGraphqlService } from './auth-graphql.service';
import { IGqlContext } from '@/common/interfaces/gqlContext.interface';
import { isDev } from '@/infra/utils/is-dev.util';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthModel } from './models/auth.model';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthGraphqlResolver {
  constructor(
    private readonly authGraphqlService: AuthGraphqlService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => AuthModel)
  async register(
    @Context() { res }: IGqlContext,
    @Args('data') input: RegisterInput,
  ) {
    const { accessToken, refreshToken } =
      await this.authGraphqlService.register(input);

    this.setRefreshCookie(res, refreshToken);

    return { accessToken };
  }

  @Mutation(() => AuthModel)
  async login(
    @Context() { res }: IGqlContext,
    @Args('data') input: LoginInput,
  ) {
    const { accessToken, refreshToken } =
      await this.authGraphqlService.login(input);

    this.setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  @Mutation(() => AuthModel)
  async refresh(@Context() { req, res }: IGqlContext) {
    const refreshToken = req.cookies['refresh_token'];

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authGraphqlService.refresh(refreshToken);

    this.setRefreshCookie(res, newRefreshToken);
    return { accessToken };
  }

  @Mutation(() => Boolean)
  async logout(@Context() { res }: IGqlContext) {
    res.clearCookie('refresh_token', {
      path: '/',
    });

    return res.sendStatus(204);
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: !isDev(),
      sameSite: 'lax',
      maxAge:
        Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN_SEC')) *
        1000,
      path: '/',
    });
  }
}
