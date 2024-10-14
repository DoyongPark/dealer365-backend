import { ENV_CONSTANT } from '@dealer365-backend/shared';
import { Module, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateDetailsService, UpdateService } from './impl';
import { IUpdateService } from './update.interface';

// 서비스 배열
const services = [
  UpdateService,
  UpdateDetailsService
];

// 팩토리 함수
function serviceFactory(configService: ConfigService, ...injectedServices: any[]) {
  const configData = configService.get(ENV_CONSTANT.REMOTE_CONFIG_DATA);
  const serviceName = configData ? JSON.parse(configData)?.config?.crm?.service?.update : 'UpdateService';

  return injectedServices.find(service => service?.constructor?.name?.toLowerCase() === serviceName?.toLowerCase());
}

@Module({
  providers: [
    ...services,
    {
      provide: IUpdateService,
      useFactory: serviceFactory,
      inject: [ConfigService, ...services],
      scope: Scope.REQUEST,
    },
  ],
  exports: [IUpdateService],
})
export class UpdateModule { }