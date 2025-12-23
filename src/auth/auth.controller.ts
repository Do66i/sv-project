import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, ValidationPipe, Body } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    // 생성자를 통해 AuthService를 주입받아 사용할 수 있게 합니다.
    constructor(private authService: AuthService) {}

    // 회원가입 요청 처리 핸들러
    @Post('/signup')
    // @Body() 뒤에 ValidationPipe를 붙여 DTO에 설정한 규칙들을 검사합니다.
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialDto,
    ): Promise<{ success: boolean; message: string; user: User }> {
        // 서비스의 signUp 함수를 호출하여 유저 정보를 저장합니다.
        return this.authService.signUp(authCredentialsDto);
    }

    // 로그인 요청 처리 핸들러
    @Post('/login')
    signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialDto,
    ): Promise<{ message: string }> {
        return this.authService.signIn(authCredentialsDto);
    }
}
