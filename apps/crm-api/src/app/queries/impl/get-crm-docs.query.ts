import { IQuery } from '@nestjs/cqrs';

export class GetCrmDocsQuery implements IQuery {
  constructor(public readonly where: any) {}
}
