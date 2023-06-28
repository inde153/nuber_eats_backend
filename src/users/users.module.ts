import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

//dependency injection
@Module({
  //유저를 추가해주고
  imports: [TypeOrmModule.forFeature([User, Verification])],
  //공급한다.
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
