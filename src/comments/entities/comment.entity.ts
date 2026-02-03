// 데이터베이스 모델
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/boards.entity';
import { User } from '../../auth/entities/user.entity';

// 응답 전용 인터페이스 정의 (수출해서 서비스에서도 쓸 수 있게 export)
export interface CommentResponse {
    id: number;
    text: string;
    likes: number;
    isPrivate: boolean;
    createdAt: Date;
}

@Entity()
export class Comment {
    @PrimaryGeneratedColumn() // 기본 키 자동 생성
    id: number;

    @Column() // 댓글 내용
    text: string;

    @Column({ default: 0 }) // 댓글 좋아요 수
    likes: number;

    @Column({ default: false }) // 댓글 비공개 여부
    isPrivate: boolean;

    @CreateDateColumn() // 댓글 생성 일시
    createdAt: Date;

    // onDelete: 'CASCADE' 설정으로 게시글 삭제 시 댓글도 자동 삭제
    @ManyToOne(() => Board, (board) => board.comments, { onDelete: 'CASCADE' })
    board: Board;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    // 이 댓글이 누구의 대댓글인지
    // nullable: true는 일반 댓글(부모 없는 댓글)도 가능
    @ManyToOne(
        ()=> Comment, (comment) => comment.children, { nullable: true }
    )
    parent : Comment;

    // 이 댓글의 대댓글 목록
    @OneToMany(() => Comment, (comment) => comment.parent)
    children: Comment[];
}
