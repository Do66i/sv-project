import { BoardsService } from './boards.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './entities/boards.entity';

// 가짜 저장소 만들기
const mockBoardRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
};

describe('BoardsService', () => {
    let service: BoardsService;
    // beforeEach: 각 테스트(it)가 실행되기 전에 무조건 실행되는 준비 과정
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BoardsService, // 진짜로 테스트할 서비스
                {
                    // "Board 리포지토리(DB)가 필요하면, 진짜 대신 가짜(mockBoardRepository)를 써라"
                    provide: getRepositoryToken(Board),
                    useValue: mockBoardRepository,
                },
            ],
        }).compile();

        service = module.get<BoardsService>(BoardsService);
    });

    // 테스트 케이스
    it ('서비스 정의 ????? >>>> ', () => {
        expect(service).toBeDefined(); // 서비스가 잘 생성됐는지 확인
    });
})
