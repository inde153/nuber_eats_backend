import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

/**ObjectType(자동으로 스키마를 빌드하기 위해 사용하는 GraphQL 데코레이터)*/
@ObjectType() // <- GraphQL
@Entity() // <- TypeORM
export class Restaurant extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((type) => Category)
  @ManyToOne((type) => Category, (category) => category.restaurants)
  category: Category;
}

// https://typeorm.io/active-record-data-mapper
//레코드 패턴과 데이터 매퍼 패턴의 이해 및 사용방법
