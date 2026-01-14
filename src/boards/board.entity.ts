import { BoardStatus } from './board.model';
import { User } from '../auth/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn() // Primary Key
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

    // @ManyToOne: 게시글(N) : 유저(1) 관계를 의미해.
    // 첫 번째 인자: 연결할 상대방 엔티티 타입 (User)
    // 두 번째 인자: 상대방 엔티티에서 나를 어떻게 부르는지 (user.boards)
    // eager: false는 유저 정보를 항상 자동으로 가져오지는 않겠다는 뜻이야 (성능 최적화)
    @ManyToOne( type => User, user => user.boards, {eager: false})
    user: User;
}
