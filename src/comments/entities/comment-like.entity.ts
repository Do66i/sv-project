import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class CommentLike {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(()=>Comment, (comment) => comment.id, { onDelete: 'CASCADE' })
    comment: Comment;
}
