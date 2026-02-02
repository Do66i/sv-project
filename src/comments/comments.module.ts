// 모듈 정의
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment} from './entities/comment.entity';
import { Board } from 'src/boards/entities/boards.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Board]),
        AuthModule // Passport 기능을 쓸 수 있게 해줌
    ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
