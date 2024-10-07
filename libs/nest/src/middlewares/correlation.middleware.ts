import { generateUUID, HttpHeaderKeysEnum } from '@dealer365/shared';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    //Request Id
    const request_id_key = HttpHeaderKeysEnum.REQUEST_ID;
    //always use lowcase when read header.
    let requestId = req.headers[request_id_key.toLowerCase()] || generateUUID();
    
    if (!req.headers[request_id_key.toLowerCase()]) {
      req.headers[request_id_key.toLowerCase()] = requestId;
    }
    if (!res.getHeader(request_id_key.toLowerCase())) {
      res.setHeader(request_id_key, requestId);
    }

    //Correlation Id
    const correlation_id_key = HttpHeaderKeysEnum.CORRELATION_ID;
    //always use lowcase when read header.
    let correlationId = req.headers[correlation_id_key.toLowerCase()] || generateUUID();
    
    if (!req.headers[correlation_id_key.toLowerCase()]) {
      req.headers[correlation_id_key.toLowerCase()] = correlationId;
    }
    if (!res.getHeader(correlation_id_key.toLowerCase())) {
      res.setHeader(correlation_id_key, correlationId);
    }

    next();
  }
}
