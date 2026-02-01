import { Controller, Post, Get, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto) {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    @ApiOperation({ summary: '로그인', description: 'JWT 토큰을 발급합니다.' })
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto) {
        return this.authService.signIn(authCredentialsDto);
    }

    @Get('/me')
    @ApiOperation({ summary: '내 정보 조회' })
    @ApiResponse({
        status: 200,
        description: '성공',
        schema: { example: { success: true, user: { id: 1, username: 'testuser' } } },
    })
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User) {
        return {
            success: true,
            user: { id: user.id, username: user.username },
        };
    }

    @Post('/logout')
    @ApiOperation({ summary: '로그아웃' })
    @UseGuards(AuthGuard())
    logout(@GetUser() user: User) {
        return { success: true, message: '로그아웃 완료' };
    }
}
