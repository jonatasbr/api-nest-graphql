import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/user.entity';

@ObjectType()
export class AuthOutput {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}
