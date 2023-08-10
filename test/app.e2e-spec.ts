import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

const GRAPHQL_ENDPOINT = `/graphql`;

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  //Jest did not exit one second after the test run has completed.에러 해결
  afterAll(async () => {
    // TypeORM 0.3.0 부터 Connection이 deprecated되고 DataSource 써야됨
    const dataSource: DataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const connection: DataSource = await dataSource.initialize();
    await connection.dropDatabase(); // 데이터베이스 삭제
    await connection.destroy(); // 연결 해제
    await app.close();
  });

  describe('createAccount', () => {
    const EMAIL = 'inde456@naver.com';
    it(`should create account`, () => {
      const a = request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation : {
            CreateAccount(input:{
              email:"${EMAIL}",
              password:"12345",
              role:"Owner"
            })  {
              ok,
              error
            }
          }`,
          // variables: createAccountInput,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
  });
});
