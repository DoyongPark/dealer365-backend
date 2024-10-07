import { CreateCrmDocHandler } from './handlers/create-crm-doc.handler';
import { UpdateCrmDocHandler } from './handlers/update-crm-doc.handler';
import { DeleteCrmDocHandler } from './handlers/delete-crm-doc.handler';

export const CommandHandlers = [CreateCrmDocHandler, UpdateCrmDocHandler, DeleteCrmDocHandler];
