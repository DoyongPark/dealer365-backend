import { DatabaseModule } from '@dealer365-backend/database';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { CrmsController } from './crm.controller';
import { CrmEventBus } from './events';
import { QueryHandlers } from './queries';

@Module({
  imports: [DatabaseModule, CqrsModule],
  controllers: [CrmsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    CrmEventBus],
})
export class CrmModule { }

