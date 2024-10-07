import { CorrelationIdMiddleware, MethodOverrideMiddleware, UserContextMiddleware } from '@dealer365-backend/nest';
import { DatabaseModule } from '@dealer365-backend/database';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrmModule } from './app/crm.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
    CrmModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    // 다이나믹 모듈 인젝션
    // {
    //   provide: 'JWT_GUARD',
    //   useFactory: (configService: ConfigService) => {
    //       const isLocal = config.get('database.connectionString') === 'local';
    //       return isLocal ? new FakeJwtGuard() : new JwtGuard();
    //   },
    //   inject: [ConfigService],
    // }
  ],
})
export class AppModule {
  constructor() {
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(MethodOverrideMiddleware).forRoutes('*');
    consumer.apply(UserContextMiddleware).forRoutes('*');
  }
}
