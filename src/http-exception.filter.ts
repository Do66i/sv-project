import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // 1. "난 HTTP 관련 에러만 전문적으로 잡겠다"는 스티커 부착
export class HttpExceptionFilter implements ExceptionFilter  {
    private logger = new Logger('HTTP_ERROR');

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        let customMessage = '요청 처리 중 오류가 발생했습니다. 🤔';

        if (status === 404) {
            customMessage =
                '길을 잃으셨나요? 입력하신 주소를 다시 확인해 주세요! 🗺️';
        } else if (status === 400) {
            customMessage =
                '입력 데이터가 올바르지 않습니다. 확인 후 다시 시도해 주세요! ❌';
        } else if (status === 500) {
            customMessage =
                '서버 내부에서 폭발이 일어났습니다! 잠시만 기다려주세요. 🔥';
        }

        let finalMessage = customMessage;

        if (typeof errorResponse === 'object' && errorResponse['message']) {
            const nestMessage = errorResponse['message'];

            // 1. NestJS 기본 라우팅 에러 (Cannot GET /...) 처리
            if (
                typeof nestMessage === 'string' &&
                nestMessage.startsWith('Cannot')
            ) {
                finalMessage = customMessage;
            }
            // 2. 메시지가 배열로 오는 경우 (Validation 에러 등) 문자열로 변환
            else if (Array.isArray(nestMessage)) {
                finalMessage = nestMessage[0]; // 첫 번째 에러 메시지만 문자열로 추출
            }
            // 3. 그 외 일반적인 문자열 메시지
            else {
                finalMessage = nestMessage;
            }
        }

        this.logger.error(
            `${request.method} ${request.url} - ${status} Error 🐛`,
        );

        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: finalMessage,
        });
    }
}
