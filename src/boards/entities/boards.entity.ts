import { BoardStatus } from '../boards.model';
import { User } from '../../auth/entities/user.entity'; // [체크] 유저 엔티티를 정확히 가져와야 함
import { Comment } from '../../comments/entities/comment.entity';
import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: BoardStatus,
        default: BoardStatus.PUBLIC, // 기본값 설정 (선택사항이지만 추천)
    })
    status: BoardStatus;

    @ManyToOne((type) => User, (user) => user.boards, { eager: false })
    user: User; // 이 줄이 있어야 서비스에서 board.user를 인식

    // 추가: 게시글 하나에는 여러 댓글이 달림
    @OneToMany(() => Comment, (comment) => comment.board, { eager: true }) // 게시글 볼 때 댓글도 바로 보이게 eager 설정 가능
    comments: Comment[];

    @DeleteDateColumn() // 소프트 삭제를 위한 컬럼 (삭제시 날짜가 자동기록)
    deletedAt: Date;
}
