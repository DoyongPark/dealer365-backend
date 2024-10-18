import { BullModule, getQueueToken } from '@nestjs/bull';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Queue } from 'bull';
import { AzureBrokerService, BullBrokerService } from './impl';
import { MessageBrokerModuleOptions } from './message-broker.module-config';
import { ConfigurableModuleClass } from './message-broker.module-definition';
import { IBrokerService } from './message-broker.service.interface';

@Module({})
export class MessageBrokerModule extends ConfigurableModuleClass {
  static forRoot(options?: MessageBrokerModuleOptions): DynamicModule {
    const imports = [];
    const providers: Provider[] = [];

    if (options) {
      if (options.type === 'azure-service-bus') {
        providers.push({
          provide: IBrokerService,
          useFactory: () => {
            return new AzureBrokerService(options);
          },
        });
      } else if (options.type === 'bull') {
        imports.push(
          BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
          BullModule.registerQueue({ name: options.queueName })
        );
        providers.push({
          provide: IBrokerService,
          useFactory: (queue: Queue) => {
            return new BullBrokerService(queue);
          },
          inject: [getQueueToken(options.queueName)],
        });
      }
    }

    return {
      module: MessageBrokerModule,
      imports: imports,
      providers: providers,
      exports: options ? [IBrokerService] : [],
    };
  }
}