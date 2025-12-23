import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BoardStatus } from './board.model';

@Entity() // 이 클래스가 DB 테이블임을 나타냄
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn() // 자동으로 늘어나느 숫자 ID
    id: number;

    @Column() // 제목
    title: string;

    @Column() // 내용
    description: string;

    @Column() // 상태
    status: BoardStatus;
}

