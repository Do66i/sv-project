import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';


describe('Auth Module (E2E)', () => {
    let app: INestApplication;
    const uniqueId = Date.now();
    const testUser = {
        username: `test${uniqueId}`,
        password: 'asdf1234',
    };

    beforeEach( async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    })

    afterAll( async () => {
        await app.close();
    });

    it('POST /auth/signup - 회원가입 성공', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send(testUser)
            .expect(201)
            .then(({ body }) => {
                expect(body).toHaveProperty('id');
                expect(body).toHaveProperty('username', testUser.username);
                expect(body).not.toHaveProperty('password');
            });
    });

    it('POST /auth/signin - 로그인 및 토큰 발급', async () => {
        const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(201);
    });
});
