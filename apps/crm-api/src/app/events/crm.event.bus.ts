import { Logger } from "@nestjs/common";

export class CrmEventBus {
  
  private readonly logger = new Logger(this.constructor.name);

  async publish(event: any) {
    this.logger.debug(`Event published. ${JSON.stringify(event)}. This will be queued soon.`);
  } 
}
