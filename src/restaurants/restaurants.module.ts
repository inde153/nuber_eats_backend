import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
  // inject(주입을 위한 import)
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
