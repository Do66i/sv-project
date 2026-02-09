import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Board } from '../boards/entities/boards.entity';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockCommentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
};

describe('CommentsService', () => {
    let service: CommentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: getRepositoryToken(Comment),
                    useValue: mockCommentRepository,
                },
                {
                    provide: getRepositoryToken(Board),
                    useValue: mockCommentRepository,
                },
                {
                    provide: getRepositoryToken(CommentLike),
                    useValue: mockCommentRepository,
                }
            ],

        }).compile();

        service = module.get<CommentsService>(CommentsService);
    });

    it('should be defined COMMENT SERVICE !!!! >>>>>>>', () => {
        expect(service).toBeDefined();
    });
});
