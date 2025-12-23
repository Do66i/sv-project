import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards/boards.entity'
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '02000200', // 추후 환경변수로 변경해야 할 듯 ?
            database: 'board_db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // 모든 엔티티 자동 로딩
            // entities: [Board], // 수동으로 엔티티 등록하는 방법
            synchronize: true, // 개발 환경에서만 사용, 실제 운영 환경에서는 마이그레이션 사용 권장
        }),
        BoardsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware) // LoggerMiddleware를 적용
            .forRoutes('*'); // 모든 경로에 대해 미들웨어 적용
    }
}
