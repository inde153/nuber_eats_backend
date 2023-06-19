import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from 'src/users/entities/users.entity';

@ObjectType()
export class MutationOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok?: boolean;
}
