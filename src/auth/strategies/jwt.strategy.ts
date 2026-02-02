import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) {
        super({
            secretOrKey: String(configService.get<string>('JWT_SECRET')), // 환경변수 사용
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    // 토큰이 유효한지 확인되면 자동으로 호출되는 함수
    async validate(payload: { username: string }) {
        const { username } = payload;
        const user: User | null = await this.userRepository.findOneBy({ username });

        if (!user) {
            throw new UnauthorizedException('토큰이.. 이상한듯한데.....!️');
        }

        // 여기서 리턴한 user 객체는 요청(Request) 객체에 자동으로 담깁니다. (req.user)
        return user;
    }
}
