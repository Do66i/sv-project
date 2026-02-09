import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * describe (설명하다): 연관된 테스트들을 묶어주는 그룹이야. "자, 지금부터 AppController 테스트를 시작할게"라고 선언하는 거지.
 *
 * it (그것은...): 실제 테스트 케이스 하나를 의미해. 보통 문장처럼 읽히게 써.
 *
 * it should return Hello World (그것은 헬로월드를 반환해야 한다)
 *
 * expect (기대하다): 결과를 검증하는 곳이야.
 *
 * expect(결과값).toBe(기대값) -> 결과값이 기대값과 같니?
 * */


describe('AppController', () => {
    // describe: 테스트 그룹
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => { // it: 개별 테스트 하나
            expect(appController.getHello()).toBe('Hello World!'); // expect: 검증(기댓값)
        });
    });
});
