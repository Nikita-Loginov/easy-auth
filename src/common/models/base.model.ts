import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
})
export class BaseModel {
  @Field((type) => ID)
  id: string;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;
}
