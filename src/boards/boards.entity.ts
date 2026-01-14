import { BoardStatus } from './boards.model';
import { User } from '../auth/user.entity'; // [체크] 유저 엔티티를 정확히 가져와야 함
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

    @ManyToOne((type) => User, (user) => user.boards, { eager: false })
    user: User; // 이 줄이 있어야 서비스에서 board.user를 인식
}
