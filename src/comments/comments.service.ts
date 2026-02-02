// 비즈니스 로직
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentResponse } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Board } from '../boards/entities/boards.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>, // 게시글 확인을 위해 주입
    ) {}

    async create(createCommentDto: CreateCommentDto, user: User): Promise<CommentResponse> {
        const { text, boardId, isPrivate } = createCommentDto;

        // 1. 게시글 존재 여부 확인
        const foundBoard = await this.boardRepository.findOneBy({ id: boardId });
        if (!foundBoard) {
            throw new NotFoundException(`ID가 ${boardId}인 게시글을 찾을 수 없습니다.`);
        }

        // 2. 댓글 생성 및 유저/게시글 연결
        const comment = this.commentRepository.create({
            text,
            isPrivate: isPrivate ?? false, // 기본값 설정 (값이 없으면 기본값 false)
            board: foundBoard,
            user, // 댓글 작성자 정보도 함께 저장
            likes: 0, // 초기 좋아요는 0
        });

        const savedComment = await this.commentRepository.save(comment);

        // 보안을 위해 반환값에서 유저나 게시글의 상세 정보는 제외하고 싶다면 여기서 처리 가능
        // 새 객체를 만들어서 필요한 것만 담아 반환 (가장 에러 없는 방식)
        return {
            id: savedComment.id,
            text: savedComment.text,
            likes: savedComment.likes,
            isPrivate: savedComment.isPrivate,
            createdAt: savedComment.createdAt,
        };
    }

    findAll() {
        return `This action returns all comments`;
    }

    findOne(id: number) {
        return `This action returns a #${id} comment`;
    }

    update(id: number, updateCommentDto: UpdateCommentDto) {
        return `This action updates a #${id} comment`;
    }

    remove(id: number) {
        return `This action removes a #${id} comment`;
    }
}
