import { CrmRepository } from '@dealer365-backend/database';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCrmDocsQuery } from '../impl/get-crm-docs.query';

@QueryHandler(GetCrmDocsQuery)
export class GetCrmDocsHandler implements IQueryHandler<GetCrmDocsQuery> {

  constructor(private readonly userRepository: CrmRepository) { }

  async execute(query: GetCrmDocsQuery) {

    const { where } = query;

    if (!where) {
      throw Error('Missing get inputs');
    }

    return await this.userRepository.findAll();
  }
}
