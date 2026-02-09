import { Module } from '@nestjs/common';
import { UserGraphqlService } from './user-graphql.service';
import { UserGraphqlResolver } from './user-graphql.resolver';

@Module({
  providers: [UserGraphqlResolver, UserGraphqlService],
})
export class UserGraphqlModule {}
