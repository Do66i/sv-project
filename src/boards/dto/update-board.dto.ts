import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBoardDto{
    @IsString() // 문자열이어야 함
    @MinLength(4) // 최소 길이 4
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
