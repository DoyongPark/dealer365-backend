import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCrmDocCommand } from './commands/impl/create-crm-doc.command';
import { CrmDocDto } from './dtos';
import { GetCrmDocsQuery } from './queries/impl/get-crm-docs.query';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CRM')
@Controller('crm')
export class CrmsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  async addCrmDoc(@Body() dto: CrmDocDto) {
    return this.commandBus.execute(new CreateCrmDocCommand(dto));
  }

  @Get()
  getCrmDocs() {
    return this.queryBus.execute(new GetCrmDocsQuery({}));
  }
}
