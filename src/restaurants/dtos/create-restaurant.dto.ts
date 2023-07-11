import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

@InputType() // 해당 타입에 따라 resolver파일에서 받는 타입이 달라짐
//OmitType은 해당 데이터만 제외하고 전부다 받는다. 또한 InputType에서만 사용할 수 있는 클래스이다.
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],

  //타입 오버라이딩 해당 옵션 사용하지 않을 경우 부모 클래스 타입 데코레이터 가져 옴 다른 방법으로는 부모 클래스에 해당 옵션과 isAbstract true필요
) {}
