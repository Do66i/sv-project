import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './boards.entity'; // 인터페이스가 아닌 Entity를 가져옵니다.
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board.model';
import { BOARD_MESSAGES } from '../common/constants/error-messages';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    // 1. 모든 게시글 가져오기
    async getAllBoards(): Promise<Board[]> {
        return await this.boardRepository.find();
    }

    // 2. 게시글 생성하기
    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const { title, description } = createBoardDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
        });

        await this.boardRepository.save(board);
        return board;
    }

    // 3. ID로 게시글 찾기 (검증 포함)
    async getBoardById(id: number): Promise<Board> {
        // MySQL 자동생성 ID는 보통 number입니다.
        const found = await this.boardRepository.findOneBy({ id });

        if (!found) {
            throw new NotFoundException(
                BOARD_MESSAGES.NOT_FOUND(id.toString()),
            );
        }

        return found;
    }

    // 4. 게시글 삭제하기
    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete(id);

        // delete 결과에 영향을 받은 행(affected)이 0개면 에러
        if (result.affected === 0) {
            throw new NotFoundException(
                BOARD_MESSAGES.NOT_FOUND(id.toString()),
            );
        }
    }

    // 5. 게시글 상태 변경하기
    async patchBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
}
