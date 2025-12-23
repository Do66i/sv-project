import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username']) // username 필드가 고유하도록 설정
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() // Primary Key
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}
