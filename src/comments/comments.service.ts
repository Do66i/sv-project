// 비즈니스 로직
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentResponse } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Board } from '../boards/entities/boards.entity';
import { User } from '../auth/entities/user.entity';
import { CommentLike } from './entities/comment-like.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>, // 게시글 확인을 위해 주입
        @InjectRepository(CommentLike)
        private commentLikeRepository: Repository<CommentLike>,
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

    async likeComment(id: number, user: User): Promise<{ success: boolean; message: string; data: CommentResponse }> {
        // 해당 댓글 찾기
        const comment = await this.commentRepository.findOneBy({ id });

        // 댓글이 존재하지 않으면 예외 발생
        if (!comment) {
            throw new NotFoundException(`ID가 ${id}인 댓글을 찾을 수 없습니다.`);
        }

        const existingLike = await this.commentLikeRepository.findOne({
            where: {
                comment: { id },
                user: { id: user.id },
            }
        });

        let message: string = '';


        // 이미 좋아요 표시를 했다면 좋아요 삭제
        console.log('>>>>>>>', this.commentLikeRepository)

        if (existingLike) {
            await this.commentLikeRepository.remove(existingLike);
            comment.likes -= 1;
            message = '좋아요 취소 반영 완료'
        } else {
            // 좋아요 표시를 하지 않았다면 좋아요 추가
            const newLike = this.commentLikeRepository.create({
                comment,
                user
            })
            await this.commentLikeRepository.save(newLike);
            comment.likes += 1;

            message = '좋아요 반영 완료'
        }

        // 저장
        const savedComment = await this.commentRepository.save(comment);

        return {
            success: true,
            message: message,
            data: {
                id: savedComment.id,
                text: savedComment.text,
                likes: savedComment.likes,
                isPrivate: savedComment.isPrivate,
                createdAt: savedComment.createdAt,
            },
        };
    }

    async update(
        id: number,
        user: User,
        updateCommentDto: UpdateCommentDto,
    ): Promise<{ success: boolean; message: string }> {
        // 내가 쓴 댓글인지 확인
        const comment = await this.commentRepository.findOne({
            where: {
                id,
                user: { id: user.id },
            },
        });

        // 새로 작성한 댓글로 업데이트
        if (!comment) {
            throw new NotFoundException(`ID가 ${id}인 댓글을 찾을 수 없거나 수정 권한이 없습니다.`);
        }

        // 객체에 새로운 데이터 덮어쓰기 (text, isPrivate 등이 선택적으로 업데이트됨)
        Object.assign(comment, updateCommentDto);

        // 업데이트 수행
        await this.commentRepository.save(comment);

        // 성공 메시지 반환
        return {
            success: true,
            message: '댓글이 성공적으로 수정되었습니다.',
        };
    }

    async remove(id: number, user: User): Promise<{ success: boolean; message: string }> {
        // 내가 쓴 댓글인지 확인하며 조회 (id, userId 모두 일치해야함)
        const result = await this.commentRepository.delete({
            id,
            user: { id: user.id },
        });

        // 삭제된 데이터가 없는 경우(내 댓글이 아니거나, 존재하지 않는 경우)
        if (result.affected === 0) {
            throw new NotFoundException(`ID가 ${id}인 댓글을 찾을 수 없거나 삭제 권한이 없습니다.`);
        }

        // 성공 메시지 반환
        return {
            success: true,
            message: '댓글이 성공적으로 삭제되었습니다.',
        };
    }
}
