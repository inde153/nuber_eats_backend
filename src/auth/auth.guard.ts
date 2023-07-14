import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/users.entity';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  //nest js의 ExecutionContext 다
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    //Graphql의 GqlExecutionContext로 바꾸는 코드
    const gqlContext = GqlExecutionContext.create(context).getContext(); // <-- app.module.ts의 graphql의 context와 동일하다.
    const user: User = gqlContext['user'];
    if (!user) {
      return false;
    }
    if (roles.includes('Any')) return true;
    //   console.log(context);
    return roles.includes(user.role);
  }
}
