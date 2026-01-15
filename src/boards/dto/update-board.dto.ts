import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto {
    @ApiProperty({
        description: '게시글 제목',
        example: '수정한 게시글 제목',
        required: true,
    })
    @IsString() // 문자열이어야 함
    @MinLength(2, { message: '제목은 최소 2글자 이상 입력해야 합니다. ✍️' }) // 최소 길이 2
    title?: string;

    @ApiProperty({
        description: '게시글 내용',
        example: '수정한 게시글 내용',
        required: false,
    })
    @IsString()
    description?: string;
}
