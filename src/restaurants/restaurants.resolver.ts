import { SetMetadata } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Role } from 'src/auth/role.decorator';
import {
  CreateRestauranInput,
  CreateRestauranOutput,
} from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';

//resolver 선 실행 후 service
@Resolver((of) => Restaurant)
export class RestaurantResolver {
  //constructor의존성 주입
  constructor(private readonly restaurantService: RestaurantService) {}

  /** 레스토랑 생성
   * @param createRestauranInput
   */
  @Mutation((returns) => CreateRestauranOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestauranInput: CreateRestauranInput,
  ): Promise<CreateRestauranOutput> {
    //async 사용시 타입 옆에 Promise 필요

    return this.restaurantService.createRestaurant(
      authUser,
      createRestauranInput,
    );
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }
}
