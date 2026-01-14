import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            // 1. 토큰이 어디서 오는지(Header의 Bearer 토큰에서 가져옴)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 2. 토큰을 만들 때 썼던 비밀키와 일치해야 함
            secretOrKey: 'secretKey',
        });
    }

    // 토큰이 유효한지 확인되면 자동으로 호출되는 함수
    async validate(payload: { username: string }) {
        const { username } = payload;
        const user: User | null = await this.userRepository.findOneBy({ username });

        console.log('>>>>>>> !!!!!!!!!!!!!!!!!!!!!!!!!', user)
        if (!user) {
            throw new UnauthorizedException('토큰이.. 이상한듯한데.....!️');
        }

        // 여기서 리턴한 user 객체는 요청(Request) 객체에 자동으로 담깁니다. (req.user)
        return user;
    }
}
