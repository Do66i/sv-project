import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        // 1. 유저 인증 전략 설정
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // 2. JWT 설정
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: 3600 }, // 1시간 동안 유효한 토큰 (3600s = 1h)
        }),
        // 3. User 엔티티를 이 모듈에서 사용하겠다고 선언!
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController], // 인증 컨트롤러
    providers: [AuthService, JwtStrategy], // 인증 서비스
    exports: [PassportModule, JwtModule, JwtStrategy], // 다른 모듈에서 인증 기능을 쓸 수 있게 내보냄
})
export class AuthModule {}
