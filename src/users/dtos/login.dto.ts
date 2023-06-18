import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((type) => String)
  token: string;
}
