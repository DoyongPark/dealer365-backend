import { UserFriendlyException } from '@dealer365-backend/shared';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    //to-do: 번역필요
    private readonly common_msg = 'Oops! Something went wrong. We apologize for the inconvenience. There seems to be a temporary issue with our server, and we are unable to process your request at the moment.';

    private readonly logger = new Logger(this.constructor.name);
    constructor(private readonly configService: ConfigService) { }

    catch(exception: HttpException, host: ArgumentsHost) {

        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        const status = exception.getStatus ? exception.getStatus() : HttpStatusCode.InternalServerError;

        const result = {
            status: status,
            success: [200, 201, 202].includes(status) ? true : false,
            error: {
                // code: '',//not used yet.
                message: exception instanceof UserFriendlyException ? exception.message : this.common_msg,
                details: {
                    originalUrl: request.originalUrl,
                    url: request.url,
                    baseUrl: request.baseUrl,
                    details: exception.stack,
                },
            },
        };

        this.logger.error(result.error);

        //잘못 된 url로 요청 한 경우, 404응답 만 리턴하고 응답을 종료 
        if (exception instanceof NotFoundException && exception?.stack?.includes('routes-resolver')) {
            response.status(status).end();
        } else {
            response.status(status).json(result);
        }
    }
}