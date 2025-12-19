import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable() // 이 클래스는 다른 곳에서 불려가서 사용될 부품이라고 생각하면 쉽다고함
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP'); // 'HTTP'라는 카테고리로 로그 생성

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, body } = req; // 요청 메서드와 URL 추출
        const startTime = Date.now(); // 요청 시작 시간 기록

        // 1. 요청이 들어왔을 때 (입구 로그)
        this.logger.log(`>>>> [REQUEST] ${method} ${originalUrl}`);
        if ( Object.keys(body || {}).length > 0) {
            this.logger.log(`Body: ${JSON.stringify(body, null, 2)}`); // JSON을 예쁘게 들여쓰기해서 출력
        }
        // 응답이 끝났을 때 로그찍기!
        res.on('finish', () => {
            const { statusCode } = res; // 응답 상태 코드 추출
            const duration = Date.now() - startTime; // 요청 처리 시간 계산

            this.logger.log(`<<<< [RESPONSE] ${method} ${originalUrl}`);
            this.logger.log(`Status: ${statusCode}`);
            this.logger.log(`Duration: ${duration}ms`);

            // 에러가 발생한 경우 (400번대, 500번대 코드일 때)
            if (statusCode >= 400) {
                this.logger.error(
                    `Error Occurred with Status Code: ${statusCode}`,
                );
            }
            this.logger.log('-------------------------------------------');
        });
        next();
    }
}
