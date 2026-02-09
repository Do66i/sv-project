import { BoardsService } from './boards.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './entities/boards.entity';
import { NotFoundException } from '@nestjs/common';

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
    it('서비스 정의 ????? >>>> ', () => {
        expect(service).toBeDefined(); // 서비스가 잘 생성됐는지 확인
    });

    describe('createBoard', () => {
        it('게시글 생성 후 반환 TEST', async () => {
            // 테스트에 필요한 가짜 데이터와 상황 설정
            const mockUser = { id: 1, username: 'doto' } as any;
            const createBoardDto = { title: 'test title', description: 'test content' };

            const expectedBoard = {
                id: 1,
                title: createBoardDto.title,
                description: createBoardDto.description,
                user: mockUser,
            };

            mockBoardRepository.create.mockReturnValue(expectedBoard);

            mockBoardRepository.save.mockResolvedValue(expectedBoard);

            // 실행 : 실제 서비스의 createBoard 함수 실행
            const result = await service.createBoard(createBoardDto, mockUser);

            // 검증 : 계획대로 실행됐는지 확인
            // * create 함수가 한 번만 호출 되었는지 확인
            expect(mockBoardRepository.create).toHaveBeenCalledTimes(1);

            // * create 함수 호출 시, 제목/내용/상태/유저정보 제대로 넣어서 호출되었는지 확인
            expect(mockBoardRepository.create).toHaveBeenCalledWith({
                title: createBoardDto.title,
                description: createBoardDto.description,
                status: 'PUBLIC', // BoardStatus.PUBLIC
                user: mockUser,
            });

            // * save 함수가 한 번만 호출 되었는지 확인
            expect(mockBoardRepository.save).toHaveBeenCalledTimes(1);

            // * 최종 결과물 확인
            expect(result).toEqual(expectedBoard);
        });
    });

    describe('getBoardById', () => {
        it('게시글이 존재한다면 반환', async () => {
            const mockId = 1;
            const mockUser = { id: 1, username: 'doto' } as any;

            // service 로직에서 commnets를 순회하므로, 빈 배열도 넣어줘야 함
            const mockBoard = {
                id: mockId,
                user: mockUser,
                comments: [],
            };

            // findOne을 호출하면 mockBoard를 찾아낸 척해라
            mockBoardRepository.findOne.mockResolvedValue(mockBoard);

            const result = await service.getBoardById(mockId, mockUser);

            // * findOne이 올바른 옵션으로 호출 되었는지 확인
            expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockId },
                relations: ['user', 'comments', 'comments.user', 'comments.parent'],
            });

            // * 결괏값에 commnetCount가 추가되었는지 확ㅇ니
            expect(result).toEqual({ ...mockBoard, commentCount: 0 });
        });

        it('게시글이 존재하지 않는다면 NotFoundException 반환', async () => {
            const mockId = 999;
            const mockUser = { id: 1, username: 'doto' } as any;

            // null 설정
            mockBoardRepository.findOne.mockResolvedValue(null);

            // 예외(Error)가 발생하는지 테스트할 때는 expect를 await와 함께 쓰고, .rejects.toThrow를 사용함
            await expect(service.getBoardById(mockId, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});
