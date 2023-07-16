import { SetMetadata } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { Category } from './entities/category.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';

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

  @Mutation((returns) => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurantInput(
      owner,
      deleteRestaurantInput,
    );
  }
}

@Resolver((of) => Category)
export class categoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField((type) => Int) //매 요청마다 계산된 필드를 만들어준다.
  restaurantCount(): number {
    return 80;
  }

  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }
}
