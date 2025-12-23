import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// 회원가입 및 로그인 시 사용할 데이터 규격 정의
export class AuthCredentialDto {
    // username: string, 4 - 20자 영어 소문자, 숫자 조합
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-z0-9]*$/, {
        message: '유저명은 영어 소문자와 숫자만 사용할 수 있습니다. 👤',
    })
    username: string;

    // password: string, 8 - 20자 영문자, 숫자, 특수문자를 최소 하나씩 포함해야하는 규칙(정규식) 적용
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        message:
            '비밀번호는 영문 소문자, 숫자, 특수문자를 최소 하나씩 포함해야 합니다. 🔐',
    })
    password: string;
}
