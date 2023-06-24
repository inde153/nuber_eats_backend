import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey); //globalModule인 configService를 사용하여 get하여 env에 접근 후 가져와서도 사용가능 해당 코드는 DI의 연습
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
