import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 입력 데이터 검증을 위한 파이프 설정
    app.useGlobalPipes(new ValidationPipe());
    // 모든 에러는 이 필터를 거침
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
