import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Users } from '../entities/users.entity';

@InputType()
export class CreateAccountInput extends PickType(Users, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok?: boolean;
}
