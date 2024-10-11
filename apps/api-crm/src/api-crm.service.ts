import { CrmDynamicService } from '@dealer365-backend/crm-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiCrmService {
  constructor(private readonly dynamicService: CrmDynamicService) {

  }
  getHello(): string {
    return this.dynamicService.executeMethod();
  }
}
