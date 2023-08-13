import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_GUARD, //guard들을 APP_GUARD가 nest 에 전체적으로 적용 시킴
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
