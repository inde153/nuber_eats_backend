import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { options } from 'joi';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) // repository 주입
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurant.findOne({
        where: { id: restaurantId },
      });
      if (!restaurant) return { ok: false, error: 'Restaurant not found' };

      let orderFinalPrice = 0;
      const orderItemList: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne({ where: { id: item.dishId } });
        if (!dish)
          return {
            ok: false,
            error: 'Dish not found',
          };

        let dishFinalPrice = dish.price;

        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );

          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice += dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice += dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice += dishFinalPrice;
        // console.log({ dish, options: item.options });
        const orderItem = await this.orderItems.save(
          this.orderItems.create({ dish, options: item.options }),
        );

        orderItemList.push(orderItem);
      }

      await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          items: orderItemList,
          total: orderFinalPrice,
        }),
      );

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        error: 'Could not create order',
      };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      console.log(user, status);
      let orders: Order[];
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: {
              id: user.id,
            },
            status: status, //상태가 존재하지 않는다면 조건이 들어가지 않는다.
          },
        });
        console.log(123, orders);
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: {
              id: user.id,
            },
            status: status,
          },
        });
        console.log(1234, orders);
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurant.find({
          where: {
            owner: {
              id: user.id,
            },
          },
          relations: ['orders'],
        });
        orders = restaurants.flatMap((restaurant) =>
          restaurant.orders.filter((order) => order.status === status),
        );
      }
      return {
        ok: true,
        orders,
      };
    } catch (err) {
      return {
        ok: false,
        error: 'Could not get orders',
      };
    }
  }
}
