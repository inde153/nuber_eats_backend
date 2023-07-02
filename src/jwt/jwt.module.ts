import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      // providers: [JwtService],

      // providers 속성은 해당 모듈에서 사용 가능한 프로바이더(provider)를 정의하는 데 사용됩니다.
      // 프로바이더는 주로 서비스, 리졸버, 팩토리, 헬퍼 등과 같은 의존성 주입(Dependency
      providers: [
        {
          provide: CONFIG_OPTIONS, //공급해줄 이름
          useValue: options, // 공급해줄 값
        },
        JwtService,
      ],
      exports: [JwtService], //노출 시켜줄 곳
    };
  }
}

// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { DatabaseModule } from '../database/database.module';
// import { LoggerModule } from '../logger/logger.module';

// @Module({
//   providers: [UserService], // UserService 프로바이더를 제공합니다.//constructor
//   imports: [DatabaseModule, LoggerModule], // DatabaseModule과 LoggerModule을 임포트합니다.
//   exports: [UserService], // UserService를 외부에 공개(export)합니다.
// })
// export class UserModule {}

// 위의 코드에서 UserModule은 providers와 imports를 사용하여 모듈을 구성하고 있습니다.

// providers에는 UserService를 정의하여 제공합니다. UserService는 UserModule 내에서 주입할 수 있는 프로바이더입니다.
// imports에는 DatabaseModule과 LoggerModule을 임포트합니다. DatabaseModule과 LoggerModule의 기능을 UserModule 내에서 사용할 수 있게 됩니다.
// 이 예시에서 UserService는 UserModule 내에서 주입하여 사용할 수 있으며, DatabaseModule과 LoggerModule의 기능을 UserModule에서 활용할 수 있게 됩니다.

// 위의 코드에서 exports 속성을 사용하여 UserService를 외부에 공개하고 있습니다.

// providers에는 UserService를 정의하여 제공합니다.
// exports에는 UserService를 포함시켜 외부에서 사용할 수 있게 됩니다.
// 이렇게 exports 속성을 사용하면 UserModule을 임포트한 다른 모듈에서 UserService를 주입하여 사용할 수 있습니다. 다른 모듈에서 UserModule을 임포트하면 동시에 UserService도 사용할 수 있게 됩니다.
