import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**ObjectType(자동으로 스키마를 빌드하기 위해 사용하는 GraphQL 데코레이터)*/
@ObjectType() // <- GraphQL
@Entity() // <- TypeORM
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  name: string;

  @Field((type) => Boolean)
  @Column()
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownerName: string;

  @Field((type) => String)
  @Column()
  categoryName: string;
}

// https://typeorm.io/active-record-data-mapper
//레코드 패턴과 데이터 매퍼 패턴의 이해 및 사용방법
