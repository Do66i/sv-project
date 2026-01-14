import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Board]), // TypeOrmModule에 Board 엔티티 등록
        AuthModule, // 인증 모듈 임포트
    ],
    controllers: [BoardsController],
    providers: [BoardsService],
})
export class BoardsModule {}
