import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserContextService } from '../middlewares';
import { HttpHeaderKeysEnum } from '@dealer365-backend/shared';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {

  private readonly logger = new Logger(this.constructor.name);
  
  private readonly _user_agent = HttpHeaderKeysEnum.USER_AGENT;
  private readonly _request_id = HttpHeaderKeysEnum.REQUEST_ID;
  private readonly _correlation_id = HttpHeaderKeysEnum.CORRELATION_ID;

  constructor(private readonly configService: ConfigService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const userContext = UserContextService.get();
    const executionTime = new Date();
    const request = context.switchToHttp().getRequest();   
    const controllerName = context.getClass().name;
    const methodName = context.getHandler().name;
    const clientIpAddress = request.connection.remoteAddress;
    const userAgent = request.headers[this._user_agent.toLowerCase()];
    const requestId = request.headers[this._request_id.toLowerCase()];
    const correlationId = request.headers[this._correlation_id.toLowerCase()];

    const response = context.switchToHttp().getResponse();

    //로깅 제외 처리에 필요한 데코레이터 추가 필요
    //audit-log 기록
    const auditLogData = {
      requestId: requestId,
      correlationId: correlationId,
      userContext: userContext,
      serviceName: controllerName,
      methodName: methodName,
      url: request.url,
      requestBody: JSON.stringify(request.body),
      responseBody: '',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      executionDateTimeUTC: executionTime,
      executionDuration: 0,
      clientIpAddress: clientIpAddress,
      clientName: userAgent,
      exception: '',
      impersonatorTenantId: '',
      impersonatorUserId: '',
    };

    return next.handle().pipe(
      tap(async (data) => {
        const executionDuration = Date.now() - executionTime.getTime();

        auditLogData.executionDuration = executionDuration;
        auditLogData.status = response.statusCode;

        //to-do: 옵셔널 하게 로깅해야 함 body의 경우, 민감정보도 포함
        auditLogData.responseBody = JSON.stringify(data),

        //비즈니스 로직이 필요한 경우 별도 Service 로 구현 예정.
        //await this.auditLogRepository.createAuditLog(auditLogData);
        this.logger.verbose(JSON.stringify(auditLogData));
      }),
      catchError(async (err) => {
        const executionDuration = Date.now() - executionTime.getTime();
        auditLogData.executionDuration = executionDuration;
        auditLogData.exception = err.stack;

        auditLogData.status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        //비즈니스 로직이 필요한 경우 별도 Service 로 구현 예정.
        //await this.auditLogRepository.createAuditLog(auditLogData);

        throw err;
      })
    );
  }
}
