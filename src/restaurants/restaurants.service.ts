import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateRestauranInput,
  CreateRestauranOutput,
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) // repository 주입
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category) //
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestauranInput: CreateRestauranInput,
  ): Promise<CreateRestauranOutput> {
    //typeORM
    // const newRestaurant = new Restaurant();
    // newRestaurant.name = createRestaurantDto.name;
    //typeORM에서 새로운 인스턴스 생성
    // const newRestaurant = this.restaurants.create({
    //     name:createRestaurantDto.name
    // })
    //그런데 Dto를 잘 작동하게 이미 만들어 두었기 때문에 바로 위의 내용처럼 할 필요는 없음
    //typeORM과 DTO를 사용하는 장점임
    try {
      const newRestaurant = this.restaurants.create(createRestauranInput);
      newRestaurant.owner = owner;
      const categoryName = createRestauranInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({
        where: { slug: categorySlug },
      });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }),
        );
      }
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {}
}
