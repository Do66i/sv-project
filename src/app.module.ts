import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module'; // AuthModule만 가져옵니다.
import { LoggerMiddleware } from './logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.local`, `.env.${process.env.NODE_ENV || 'development'}`],
            isGlobal: true, // 전역 모듈로 설정해서 어디서든 쓸 수 있게 함
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            // process.env를 사용해서 .env 파일의 값을 가져옴
            host: process.env.DB_HOST,
            port: parseInt(String(process.env.DB_PORT), 10) || 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV !== 'production', // 프로덕션에선 false 권장
        }),
        BoardsModule,
        AuthModule,
        CommentsModule, // 인증 관련은 여기서 다 처리합니다.
    ],
    // AppModule은 AppController와 AppService만 관리합니다.
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
