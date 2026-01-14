import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // handleRequest는 인증 시도가 끝난 후 호출되는 함수야.
    handleRequest(err, user, info) {
        // 토큰이 없거나 잘못되면 user가 없어.
        if (err || !user) {
            console.log('🚨 [인증 실패 기록]:', info?.message); // 터미널에 찍힘

            // 이 메시지가 포스트맨 응답으로 나감!
            throw new UnauthorizedException(
                `인증 실패: ${info?.message === 'No auth token' ? '전송된 토큰이 없습니다.' : info?.message}`,
            );
        }
        return user;
    }
}
