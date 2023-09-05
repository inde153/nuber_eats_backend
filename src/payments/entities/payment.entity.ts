import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType() // <- GraphQL
@Entity() // <- TypeORM
export class Payment extends CoreEntity {
  @Field((type) => Int)
  @Column()
  transactionId: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.payments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: User;

  // 이와 같이 릴레이션 할 때 ID를 임의적으로 생성할 수 있음
  @RelationId((order: Payment) => order.user)
  userId: number;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  restaurant: Restaurant;

  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
