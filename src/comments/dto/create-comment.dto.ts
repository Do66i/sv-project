// 데이터 검증 규격
// 클라이언트(프론트엔드)에서 댓글을 달 때 서버로 보내줄 데이터 규격을 정하는 곳

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ description: '댓글 내용'})
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: '게시글 ID'})
    @IsNotEmpty()
    @IsNumber()
    boardId: number;

    @ApiProperty({ description: '비밀 댓글 여부'})
    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;
}
