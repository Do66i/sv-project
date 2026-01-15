import { IsEnum, IsNotEmpty } from 'class-validator';
import { BoardStatus } from '../boards.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardStatusDto {
    @ApiProperty({
        description: '게시글 상태',
        example: 'PUBLIC',
        enum: BoardStatus,
    })
    @IsNotEmpty({ message: '상태값 is 필수! ❌' })
    @IsEnum(BoardStatus, {message: '상태는 PUBLIC 또는 PRIVATE이어야 합니다.'})
    status: BoardStatus; // 변경할 게시글 상태
};
