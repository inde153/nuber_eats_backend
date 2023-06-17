import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

type UsersRole = 'client' | 'owner' | 'delivery';

@InputType()
@ObjectType({ isAbstract: true }) //어노테이션의 순서도 중요하다.
@Entity()
export class Users extends CoreEntity {
  @Column()
  @Field((type) => String)
  email: String;

  @Column()
  @Field((type) => String)
  password: String;

  @Column()
  @Field((type) => String)
  role: UsersRole;
}
