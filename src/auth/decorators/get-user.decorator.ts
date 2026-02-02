// 컨트롤러에서 로그인한 유저 정보를 아주 쉽게 가져오게 해주는 커스텀 데코레이터
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

// 요청(Request) 객체 안에 담긴 user 정보를 쏙 뽑아주는 역할
export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext): User => {
        // 사용자 요청 정보를 통째로 가져와서 (ExecutionContext)
        const req = ctx.switchToHttp().getRequest();
        // 그 안에 문지기(AuthGuard)가 넣어둔 유저 정보만 리턴!
        return req.user;
    }
)
