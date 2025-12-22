import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { v4 as uuid } from 'uuid';

@Injectable() // 이 클래스는 다른 곳에서 불려가서 사용될 부품이라고 생각하면 쉽다고함
export class BoardsService {
    // 1. 데이터 저장소 (추후 DB랑 연결)
    private boards: Board[] = [];

    // 2. 모든 게시글을 가져오는 함수
    // 리턴 타입이 Board[]를 명시
    getAllBoards(): Board[] {
        return this.boards;
    }

    // 3. 게시글을 생성하는 함수
    createBoard(creatBoardDto: CreateBoardDto): Board {
        const { title, description } = creatBoardDto;

        const board: Board = {
            id: uuid(),
            title,
            description,
            status: BoardStatus.PUBLIC,
        };

        this.boards.push(board);
        return board;
    };

    // 4. 게시글을 삭제하는 함수
    deleteBoard(id: string): void {
        const found = this.getBoardById(id);
        this.boards = this.boards.filter((board) => board.id !== found.id);
    }

    // 게시글 아이디 검증
    getBoardById(id: string): Board {
        const found = this.boards.find((board) => board.id === id);
        // ID 없다면 에러
        if (!found) {
          throw new NotFoundException(
              `ID가 "${id}"인 게시글을 찾을 수 없습니다. 😭`,
          );
        }
        return found;
    };
}
