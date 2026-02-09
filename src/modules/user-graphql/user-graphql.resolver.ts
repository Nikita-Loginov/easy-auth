import { Query, Resolver } from '@nestjs/graphql';
import { UserGraphqlService } from './user-graphql.service';
import { UserModel } from './models/user.model';
import { Authorization } from '../auth-graphql/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { User, UserRole } from 'generated/prisma/client';

@Resolver()
export class UserGraphqlResolver {
  constructor(private readonly userGraphqlService: UserGraphqlService) {}
  @Authorization()
  @Query(() => UserModel)
  getMe(@Authorized() user: User) {
    return user
  }

  @Authorization(UserRole.ADMIN)
  @Query(() => [UserModel])
  getUsers() {
    return this.userGraphqlService.getUsers()
  }
}
