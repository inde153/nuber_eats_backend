import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateRestauranInput } from './create-restaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestauranInput) {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
