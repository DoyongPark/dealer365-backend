// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmEntity, CrmRepository, CrmSchema } from './crm';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: 'mongodb://inventis:dpass%40word@20.196.96.247:27017/dealer365-api?authSource=admin'//config.get('database.connectionString'), 
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: CrmEntity.name, schema: CrmSchema }]), // CrmEntityModel 추가
  ],
  providers: [CrmRepository],
  exports: [CrmRepository]
})
export class DatabaseModule { }
