import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/boards.entity'; // 인터페이스가 아닌 Entity를 가져옵니다.
import { User } from '../auth/entities/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards.model';
import { BOARD_MESSAGES } from '../common/constants/error-messages';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    // 1. 모든 게시글 가져오기
    async getAllBoards(search?: string): Promise<Board[]> {
        const query = this.boardRepository
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user'); // relations: ['user']와 똑같은 역할!
        // note: createQueryBuilder ? TypeORM에서 제공하는 쿼리 빌더로, 복잡한 쿼리를 작성할 때 유용합니다.

        if (search) {
            query.andWhere(
                '(board.title LIKE :search OR board.description LIKE :search)',
                // board.title LIKE : search OR board.description LIKE: search ? title 또는 description에 검색어가 포함된 게시글을 찾습니다.
                { search: `%${search}%` },
            );
        }

        return await query.getMany();
        // return await this.boardRepository.find({ relations: ['user'] });
    }

    // 2. 게시글 생성하기
    async createBoard(
        createBoardDto: CreateBoardDto,
        user: User,
    ): Promise<Board> {
        const { title, description } = createBoardDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user, // 작성자 정보도 함께 저장
        });

        await this.boardRepository.save(board);
        return board;
    }

    // 3. ID로 게시글 찾기 (검증 포함)
    async getBoardById(id: number, user: User): Promise<Board> {
        // MySQL 자동생성 ID는 보통 number입니다.
        // relations에 'comments.user'를 써서 댓글 쓴 사람 정보까지 가져옴
        const board = await this.boardRepository.findOne({
            where: { id },
            relations: ['user', 'comments', 'comments.user'],
        });

        if (!board) {
            throw new NotFoundException(BOARD_MESSAGES.NOT_FOUND(id.toString()));
        };

        // 댓글 필터링 (배열이기 때문에 한 번 돌려줘야함)
        board.comments = board.comments.map(el => {
            // [조건 체크]
            // 1. 비밀 댓글이 아니면 통과
            // 2. 로그인한 유저가 게시글 작성자(board.user.id)면 통과
            // 3. 로그인한 유저가 댓글 작성자(comment.user.id)면 통과
            const isWriter = user && ( user.id === board.user.id || user.id === el.user.id);

            // 권한이 없으면 내용이 바뀜
            if (el.isPrivate && !isWriter) {
                return {
                    ...el, // 기존 댓글의 다른 데이터(id, likes 등)는 유지하고
                    text: '비밀 댓글입니다. 😎', // text만 변경
                };
            }

            return el;
        })


        return board;
    }

    // 4. 게시글 삭제하기
    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({
            id,
            user: { id: user.id }, // 작성자 ID로 조건 추가
        });

        // delete 결과에 영향을 받은 행(affected)이 0개면 에러
        if (result.affected === 0) {
            throw new NotFoundException(
                BOARD_MESSAGES.NOT_FOUND(id.toString()),
            );
        }
    }

    // 5. 게시글 상태 변경하기
    async updateBoardStatus(
        id: number,
        status: BoardStatus,
        user: User,
    ): Promise<Board> {
        const board = await this.boardRepository.findOne({
            where: { id, user: { id: user.id } },
        });

        if (!board) {
            throw new NotFoundException(
                BOARD_MESSAGES.NOT_FOUND(id.toString()),
            );
        }

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

    // 5-1. 게시글 수정하기
    async updateBoard(
        id: number,
        updateBoardDto: UpdateBoardDto,
        user: User
    ): Promise<Board> {
        const { title, description } = updateBoardDto;

        // 내 게시글인지 확인
        const board = await this.boardRepository.findOne({
            where: { id, user: { id: user.id } },
        });

        if (!board) {
            throw new NotFoundException(
                BOARD_MESSAGES.NOT_FOUND(id.toString()),
            );
        }

        // 업데이트할 필드만 수정
        if (title) board.title = title;
        if (description) board.description = description;

        await this.boardRepository.save(board); // 변경사항 저장

        return board;
    }

    // 6. 내가 쓴 게시물 가져오기
    async getMyBoards(user: User): Promise<Board[]> {
        // Query Builder를 사용해서 userId가 일치하는 것만 필터링
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id });

        // getMany = 여러 개 가져오기
        return await query.getMany();
    }
}
