import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
    @IsNotEmpty({ message: '제목은 필수 입력 항목입니다! ✍️' })
    title: string;

    @IsNotEmpty({ message: '내용을 입력해주세요! 📝' })
    description: string;
}
