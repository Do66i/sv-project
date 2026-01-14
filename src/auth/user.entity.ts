import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, } from 'typeorm';
import { Board } from '../boards/boards.entity'; // 게시글 엔티티를 가져옴

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ select: false }) // 보안을 위해 조회 시 비밀번호는 기본적으로 제외
    password: string;

    // 유저(1) : 게시글(N) 관계
    @OneToMany((type) => Board, (board) => board.user, { eager: false })
    boards: Board[];
}
