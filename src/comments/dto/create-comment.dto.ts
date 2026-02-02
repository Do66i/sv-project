// 데이터 검증 규격
// 클라이언트(프론트엔드)에서 댓글을 달 때 서버로 보내줄 데이터 규격을 정하는 곳

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty({ message: '댓글 내용은 비어있을 수 없습니다.' })
    @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
    text: string;

    @IsNotEmpty({ message: '게시글 ID는 필수 항목입니다.' })
    @IsNumber({}, { message: '게시글 ID는 숫자여야 합니다.' })
    boardId: number;

    @IsOptional()
    @IsBoolean({ message: '비밀 댓글 여부는 참(true) 또는 거짓(false)이어야 합니다.' })
    isPrivate?: boolean;
}
