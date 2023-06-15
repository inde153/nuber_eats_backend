import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
//업데이트인풋타입 클래스 생성 후 PartialType으로 CreateRestaurantDto를 상속받는다.
export class updateRestaurantInputType extends PartialType(
  CreateRestaurantDto, // <-- 해당 클래스는 Input타입
) {}

@InputType()
/** Restaurant업데이트 클래스 */
export class updateRestaurantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => updateRestaurantInputType) //그래프QL type은 해당 데이터로 한다.
  data: updateRestaurantInputType;
}
