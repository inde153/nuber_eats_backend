import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  CreateRestauranInput,
  CreateRestauranOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) // repository 주입
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(CategoryRepository) //
    private readonly categories: CategoryRepository,
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
      const category = await this.categories.getOrCreate(
        createRestauranInput.categoryName,
      );
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
  ): Promise<EditRestaurantOutput> {
    try {
      await this.getRestaurant(owner.id, editRestaurantInput.restaurantId);
      let category: Category = null;

      //카테고리가 있으면 있는지 확인하고 카테고리 테이블에 추가
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }

  async deleteRestaurantInput(
    owner: User,
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.getRestaurant(
        owner.id,
        deleteRestaurantInput.restaurantId,
      );
      if (!restaurant.ok) throw new Error('');
      await this.restaurants.delete(deleteRestaurantInput.restaurantId);
      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        error: 'Could not delete restaurant',
      };
    }
  }

  async getRestaurant(ownerId: number, restaurantId: number) {
    const restaurant = await this.restaurants.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      return {
        ok: false,
        error: 'Restaurant not found',
      };
    }
    if (ownerId !== restaurant.ownerId) {
      return {
        ok: false,
        error: "You can't deit a restaurant that you don't owner",
      };
    }
    return {
      ok: true,
    };
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load Categories',
      };
    }
  }

  countRestaurants(category: Category) {
    //카운트 카테고리의 아이디 카테고리 아이디
    return this.restaurants.count({
      where: {
        category: {
          id: category.id,
        },
      },
    });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: { slug: slug },
        relations: ['restaurants'],
      });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const restaurants = await this.restaurants.find({
        where: {
          id: category.id,
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      category.restaurants = restaurants;
      const totalResults: number = await this.countRestaurants(category);
      return {
        ok: true,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (err) {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }
}
