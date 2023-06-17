import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

//dependency injection
@Module({
  //유저를 추가해주고
  imports: [TypeOrmModule.forFeature([User])],
  //해당 유저에 공급한다.
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
