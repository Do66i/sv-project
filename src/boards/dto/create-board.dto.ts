import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
    @ApiProperty({
        example: '게시글 제목입니다.',
        description: '게시글의 제목',
    })
    @IsNotEmpty({ message: '제목은 필수 입력 항목입니다! ✍️' })
    title: string;

    @ApiProperty({
        example: '게시글 내용입니다.',
        description: '게시글의 내용',
    })
    @IsNotEmpty({ message: '내용을 입력해주세요! 📝' })
    description: string;
}
