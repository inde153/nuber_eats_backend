import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { updateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) // repository 주입
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    //typeORM
    // const newRestaurant = new Restaurant();
    // newRestaurant.name = createRestaurantDto.name;
    //typeORM에서 새로운 인스턴스 생성
    // const newRestaurant = this.restaurants.create({
    //     name:createRestaurantDto.name
    // })
    //그런데 Dto를 잘 작동하게 이미 만들어 두었기 때문에 바로 위의 내용처럼 할 필요는 없음
    //typeORM과 DTO를 사용하는 장점임
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    return this.restaurants.save(newRestaurant);
  }

  updateRestaurant({ id, data }: updateRestaurantDto) {
    return this.restaurants.update(id, { ...data });
  }
}
