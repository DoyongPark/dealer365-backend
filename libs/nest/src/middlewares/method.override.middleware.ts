import { HttpHeaderKeysEnum } from '@dealer365-backend/shared';
import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';

@Injectable()
export class MethodOverrideMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    const requestOverrideMethod = req.headers[HttpHeaderKeysEnum.X_HTTP_METHOD_OVERRIDE.toLowerCase()];

    if (requestOverrideMethod) {
      const allowedMethods = Object.keys(RequestMethod);
      if (allowedMethods.includes(requestOverrideMethod)) {
        req.method = requestOverrideMethod;
      }
    }

    next();
  }
}
