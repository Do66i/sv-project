import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

// 컨트롤러가 사용하는 함수들만 껍데기로 만들기
const mockCommentService = {
    createComment: jest.fn(),
    getAllComments: jest.fn(),
    deleteComment: jest.fn(),
    updateComment: jest.fn(),
};

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
            provide: CommentsService,
            useValue: mockCommentService },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined COMMENT CONTROLLER >>>>', () => {
    expect(controller).toBeDefined();
  });
});
