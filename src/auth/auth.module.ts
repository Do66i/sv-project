import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Module({
    imports: [
        // 1. User 엔티티를 이 모듈에서 사용할 수 있도록 TypeORM에 등록합니다.
        // 이렇게 해야 데이터베이스에 'user' 테이블이 자동으로 생성됩니다.
        TypeOrmModule.forFeature([User]),
    ],
    // 2. 외부에서 들어오는 요청을 제일 먼저 받는 문지기 역할을 설정합니다.
    controllers: [AuthController],
    // 3. 실제 비즈니스 로직(회원가입 등)을 수행하는 일꾼을 등록합니다.
    providers: [AuthService],
})
export class AuthModule {}
