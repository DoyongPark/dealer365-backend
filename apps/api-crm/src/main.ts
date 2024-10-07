import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuditLogInterceptor, AuthGuard, HttpExceptionFilter, ResourceGuard, ResponseInterceptor } from '@dealer365-backend/nest';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.flushLogs();

  //to-do: danamic/remote config
  const config = app.get(ConfigService);

  // app.use(compression);

  app.use(helmet());

  app.enableCors();//to-do: cors 옵션 설정 필요

  // Swagger 설정
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle('API Swagger')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증이 필요한 경우
    .build())); // '/doc' 경로에 Swagger UI 설정

  //version
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
  
  app.setGlobalPrefix('api');

  app.useGlobalGuards(
    new AuthGuard(config),
    new ResourceGuard(config)
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(config)
  );

  app.useGlobalInterceptors(
    new AuditLogInterceptor(config),
    new ResponseInterceptor(config)
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터를 DTO로 변환
      whitelist: true, // DTO에 정의된 필드만 허용
    })
  );

  await app.listen(config.get('server.port'));

  app.enableShutdownHooks();
}
bootstrap();
