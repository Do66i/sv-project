import {
    Controller,
    Param,
    ParseIntPipe,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, ValidationPipe, Body , Get} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport'; // JWT 인증 가드 임포트
import { GetUser } from './get-user.decorator';
import {
    ApiBody,
    ApiOperation,
    ApiProperty,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth') // Swagger 태그 설정
@Controller('auth')
export class AuthController {
    // 생성자를 통해 AuthService를 주입받아 사용할 수 있게 합니다.
    constructor(private authService: AuthService) {}

    // 회원가입 요청 처리 핸들러
    @Post('/signup')
    @ApiOperation({
        summary: '회원가입',
        description: '새로운 사용자를 등록합니다.',
    })
    @ApiProperty({
        description: '회원가입 요청',
        example: {
            User,
        },
    })
    @ApiBody({
        description: '회원가입 정보',
        type: AuthCredentialDto,
    })
    // @Body() 뒤에 ValidationPipe를 붙여 DTO에 설정한 규칙들을 검사합니다.
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialDto,
    ): Promise<{ success: boolean; message: string; user: User }> {
        // 서비스의 signUp 함수를 호출하여 유저 정보를 저장합니다.
        return this.authService.signUp(authCredentialsDto);
    }

    // 로그인 요청 처리 핸들러
    @Post('/login')
    @ApiOperation({
        summary: '로그인',
        description: '사용자 인증을 수행하고 JWT 토큰을 발급합니다.',
    })
    @ApiProperty({
        description: '로그인 요청',
        example: {
            username: 'testuser',
        },
    })
    @ApiBody({
        description: '로그인 정보',
        type: AuthCredentialDto,
    })
    signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialDto,
    ): Promise<{ message: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    // 현재 인증된 유저 정보 조회 핸들러
    @Get('/me')
    @ApiOperation({
        summary: '현재 인증된 유저 정보 조회',
        description: '현재 인증된 유저의 정보를 반환합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '유저 정보 조회 성공',
        schema: {
            example: {
                success: true,
                message: '로그인 세션이 유효합니다. ✅',
                user: {
                    id: 1,
                    username: 'testuser',
                },
            },
        },
    })
    @UseGuards(AuthGuard()) // [중요] 토큰이 있어야만 이 함수가 실행돼!
    getMe(@GetUser() user: User) {
        // @GetUser()가 토큰을 까서 유저 정보를 이미 다 가져온 상태야.
        // password는 엔티티 설정이나 서비스 로직에 의해 이미 걸러져 있을 거야.
        return {
            success: true,
            message: '로그인 세션이 유효합니다. ✅',
            user: {
                id: user.id,
                username: user.username,
            },
        };
    }

    // 로그아웃 요청 처리 핸들러 (기본만. 보통 JWT는 클라이언트에서 토큰을 삭제하여 로그아웃 처리)
    @Post('/logout')
    @ApiOperation({
        summary: '로그아웃',
        description: '사용자 로그아웃 요청을 처리합니다.',
    })
    @ApiProperty({
        description: '로그아웃 요청',
        example: {
            message:
                '서버 로그아웃 처리가 완료되었습니다. 클라이언트는 저장된 토큰을 파기하세요.',
        },
    })
    @UseGuards(AuthGuard()) // 토큰이 없다면 접근불가
    logout(@GetUser() user: User) {
        // 로그에 누가 로그아웃했는지 남겨주면 관리하기 좋겠지?
        console.log(`${user.username}님이 로그아웃을 시도합니다.`);

        return {
            success: true,
            message:
                '서버 로그아웃 처리가 완료되었습니다. 클라이언트는 저장된 토큰을 파기하세요.',
        };
    }
}
