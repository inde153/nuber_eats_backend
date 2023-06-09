import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';

/**ObjectType(자동으로 스키마를 빌드하기 위해 사용하는 GraphQL 데코레이터)*/
@InputType('CategoryInputType', { isAbstract: true })
@ObjectType() // <- GraphQL
@Entity() // <- TypeORM
export class Category extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((type) => [Restaurant], { nullable: true })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}

// https://typeorm.io/active-record-data-mapper
//레코드 패턴과 데이터 매퍼 패턴의 이해 및 사용방법
