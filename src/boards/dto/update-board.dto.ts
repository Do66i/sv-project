import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBoardDto {
    @IsString() // 문자열이어야 함
    @MinLength(2, { message: '제목은 최소 2글자 이상 입력해야 합니다. ✍️' }) // 최소 길이 2
    title?: string;

    @IsString()
    description?: string;
}
