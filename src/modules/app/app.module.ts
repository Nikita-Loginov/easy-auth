import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { UserGraphqlModule } from '../user-graphql/user-graphql.module';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { getGraphlConfig } from '@/infra/configs/graphql.config';
import { AuthGraphqlModule } from '../auth-graphql/auth-graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(getGraphlConfig()),
    AuthModule,
    PrismaModule,
    UserGraphqlModule,
    AuthGraphqlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
