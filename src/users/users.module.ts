import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

//dependency injection
@Module({
  //유저를 추가해주고
  imports: [TypeOrmModule.forFeature([Users])],
  //해당 유저에 공급한다.
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
