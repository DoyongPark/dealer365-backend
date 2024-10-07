import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { jwtDecode } from "jwt-decode";

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    UserContextService.run(() => {
      if (req?.headers?.authorization) {
        var claim: any = jwtDecode(req.headers.authorization as string);
        UserContextService.set(claim);
      }
      next();
    });
  }
}


@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  // Run method to initialize a new context for each request
  static run(callback: () => void) {
    const context = new Map<string, any>();
    this.asyncLocalStorage.run(context, callback);
  }

  // Set a value in the current context
  static set(value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set('UserContext', value);
    }
  }

  // Get a value from the current context
  static get<T>(): T | undefined {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      return store.get('UserContext');
    }
    return undefined;
  }

  static getUserContext<T>(): T | undefined {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      return store.get('UserContext') as T;
    }
    return undefined;
  }

}
