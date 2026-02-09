import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'generated/prisma/client';
import { UserRole } from 'generated/prisma/client';
import { BaseModel } from '@/common/models/base.model';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType({
  description: 'Модель пользователя',
})
export class UserModel extends BaseModel implements User {
  @Field((type) => String, {
    description: 'Имя пользователя',
  })
  name: string;

  @Field((type) => String, {
    description: 'Почта пользователя',
  })
  email: string;

  @Field((type) => String, {
    description: 'Пароль пользователя',
  })
  password: string;

  @Field((type) => UserRole, {
    description: 'Роль пользователя',
  })
  role: UserRole;
}
