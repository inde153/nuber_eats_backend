import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  //nest js의 ExecutionContext 다
  canActivate(context: ExecutionContext) {
    //Graphql의 GqlExecutionContext로 바꾸는 코드
    const gqlContext = GqlExecutionContext.create(context).getContext(); // <-- app.module.ts의 graphql의 context와 동일하다.
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    //   console.log(context);
    return true;
  }
}
