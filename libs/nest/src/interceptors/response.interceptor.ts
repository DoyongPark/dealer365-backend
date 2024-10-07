import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';
import { isArray, isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly configService: ConfigService) { }
  intercept(context: any, next: CallHandler): Observable<any> {
    if (context.getType() === 'graphql') return next.handle();

    return next.handle().pipe(
      map((data) => {
        const executionContext: ExecutionContext = context;
        const http = executionContext.switchToHttp();
        const request = http.getRequest<Request>();

        let isSuccess = false;
        if (request.res?.statusCode == 200 || request.res?.statusCode == 201 || request.res?.statusCode == 202) isSuccess = true;

        if (this.isPaginatedResult(data)) {
          //if (request.res?.statusCode == 202 || request.res?.statusCode == 201)
          //   request.res?.setHeader(
          //     'Location',
          //     request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + data.data[0].id
          //   );
          // console.log(request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + data.data[0].id);
          return {
            //...data, //Page처리 혹은 Entity Id를 포함하여 데이터를 내려주는 경우
            success: isSuccess,
            status: request.res?.statusCode,
            totalCount: data.totalCount || 0,
            hasMore: data.hasMore || false,
            error: null,
            data: isObject(data.data) ? this.transformResponse(data.data) : data.data,
          };
        }

        if (Buffer.isBuffer(data)) {
          request.res?.setHeader(
            'Content-Disposition', 'attachment'
          );

          request.res?.setHeader(
            'Content-Type', 'application/octet-stream'
          );

          request.res?.send(data);

          return null;
        }

        if (data?.id && (request.res?.statusCode == 202 || request.res?.statusCode == 201))
          request.res?.setHeader(
            'Location',
            request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + data.id
          );
          
        //console.log(request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + data.id);
        return {
          success: isSuccess,
          status: request.res?.statusCode,
          totalCount: null,
          hasMore: null,
          error: null,
          data: isObject(data) ? this.transformResponse(data) : data,
        };
      })
    );
  }

  /**
   * This method is used to determine if the entire object should be returned or just the data property
   *   for paginated results that already contain the data wrapper, true.
   *   for single entity result that *could* contain data object, false.
   * @param data
   * @private
   */
  private isPaginatedResult(data) {
    const hasListData = isArray(data?.data);
    const hasTotalCount = data?.totalCount !== undefined;
    const hasHasMore = data?.hasHasMore !== undefined;;

    return hasListData || (hasTotalCount && hasHasMore);
  }

  private transformResponse(response) {
    if (isArray(response)) {
      return response.map((item) => this.transformToPlain(item));
    }

    return this.transformToPlain(response);
  }

  private transformToPlain(plainOrClass) {
    return plainOrClass && plainOrClass.constructor !== Object ? instanceToPlain(plainOrClass) : plainOrClass;
  }
}
