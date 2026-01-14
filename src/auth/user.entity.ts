import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Board } from "../boards/board.entity";

@Entity()
@Unique(['username']) // username 필드가 고유하도록 설정
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() // Primary Key
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    // @OneToMany: 유저(1) : 게시글(N) 관계를 의미해.
    // 첫 번째 인자: 연결할 상대방 엔티티 타입 (Board)
    // 두 번째 인자: 상대방 엔티티에서 나를 어떻게 부르는지 (board.user)
    @OneToMany((type) => Board, board => board.user, {
        eager: false, // User 엔티티를 조회할 때 Board 엔티티를 함께 로드하지 않음
    })
    boards: Board[];
}
