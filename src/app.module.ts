import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer){
        consumer
            .apply(LoggerMiddleware) // LoggerMiddleware를 적용
            .forRoutes('*'); // 모든 경로에 대해 미들웨어 적용
    };
}
