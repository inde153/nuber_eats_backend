import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { NEW_PENDING_ORDER, PUB_SUB } from 'src/common/common.constants';
import { User } from 'src/users/entities/users.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Subscription((returns) => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
      console.log(ownerId, user.id);
      return ownerId === user.id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  // @Mutation((returns) => Boolean)
  // async potatoReady(@Args('potatoId') potatoId: number) {
  //   //트리거의 이름과 publish하는 이름은 같아야한다.
  //   await this.pubSub.publish('hotPotatos', {
  //     //payload는 객체여야 한다. Subscription 함수와 이름이 같으면된다.
  //     readyPotato: potatoId,
  //   });
  //   return true;
  // }

  // @Subscription((returns) => String, {
  //   //유저가 알람을 받을지 말지 결정
  //   filter: ({ readyPotato }, { potatoId }) => {
  //     return readyPotato === potatoId;
  //   },
  //   //subscription의 output 모습 변경
  //   // resolver함수가 리턴하는 값은 pubsub.asyncIterator()를 통해 받는 값이 됩니다. publish한 event payload를 변형하려면 resolve 속성을 함수로 설정합니다. 함수는 이벤트 payload를 수신하고 적절한 값을 반환합니다.
  //   resolve: ({ readyPotato }) =>
  //     `Your potato with the id ${readyPotato} is ready!`,
  // })
  // //listening
  // @Role(['Any'])
  // readyPotato(@Args('potatoId') potatoId: number) {
  //   return this.pubSub.asyncIterator('hotPotatos');
  // }
}

// 만약 potatoReady, readyPotatos가 동일한 Args를 받는다면 filter를 해줘야 함
