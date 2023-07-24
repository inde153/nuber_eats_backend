import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
/**ObjectType(자동으로 스키마를 빌드하기 위해 사용하는 GraphQL 데코레이터)*/
@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType() // <- GraphQL
@Entity() // <- TypeORM
export class Order extends CoreEntity {
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  customer?: User;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  driver?: User;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  restaurant: Restaurant;

  @Field((type) => [Dish])
  @ManyToMany((type) => Dish)
  @JoinColumn()
  dishes: Dish[];

  @Column()
  @Field((type) => Float)
  total: number;

  @Column({ type: 'enum', enum: OrderStatus })
  @Field((type) => OrderStatus)
  status: OrderStatus;
}
