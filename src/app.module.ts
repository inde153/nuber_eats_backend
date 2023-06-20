import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/users.entity';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      //전역적으로 사용할 것인지에 대한 옵션
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
      //프로덕트 환경일 때 envFilePath무시
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      //환경변수 밸리데이션
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: true,
      // entities: [Restaurant],
      entities: [User],
    }),
    // 그래프QL 스키마가 하나도 없는 경우 Query root type must be provided 에러 발생 주석처리 필요
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    // RestaurantsModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
