import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      // providers: [JwtService],

      // providers 속성은 해당 모듈에서 사용 가능한 프로바이더(provider)를 정의하는 데 사용됩니다.
      // 프로바이더는 주로 서비스, 리졸버, 팩토리, 헬퍼 등과 같은 의존성 주입(Dependency
      providers: [
        {
          provide: CONFIG_OPTIONS, //공급해줄 이름
          useValue: options, // 공급해줄 값
        },
      ],
      exports: [], //노출 시켜줄 곳
    };
  }
}
