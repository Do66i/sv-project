import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    // 테스트가 끝나면 앱을 종료 (DB 연결 해제 등)
    afterAll(async () => {
        await app.close();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer()) // 가짜 브라우저로(supertest) 요청 보냄
            .get('/') // 루트 경로에 GET 요청
            .expect(200) // 응답 상태 코드가 200인지 확인
            .expect('Hello World!'); // 응답 본문이 'Hello World!'인지 확인
    });
});
