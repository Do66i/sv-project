import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';

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
    createBoard(title: string, description: string): Board {
        const board: Board = {
            id: Date.now().toString(), // 임시로 현재시간
            title,
            description,
            status: BoardStatus.PUBLIC // 기본값은 공개
        };

        this.boards.push(board); // 배열에 새 게시글 추가
        return board; // 생성된 게시글 반환
    }
}
