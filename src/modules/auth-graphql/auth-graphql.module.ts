import { Module } from '@nestjs/common';
import { AuthGraphqlService } from './auth-graphql.service';
import { AuthGraphqlResolver } from './auth-graphql.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: Number(config.getOrThrow('JWT_ACCESS_EXPIRES_IN_SEC')),
        },
        verifyOptions: {
          ignoreExpiration: false,
        },
      }),
    }),
  ],
  providers: [AuthGraphqlResolver, AuthGraphqlService, JwtStrategy],
})
export class AuthGraphqlModule {}
