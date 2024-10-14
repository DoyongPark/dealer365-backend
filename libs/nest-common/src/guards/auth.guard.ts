import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      throw new ForbiddenException('Authorization token is missing');
    }

    const authType = this.configService.get('auth.type');;

    Logger.debug(`${authType}.auth.guard loaded`);

    if (authType === 'keycloak') {
      return true;
    } else if (authType === 'entra') {
      return false;
    }

    return true;
  }
}
