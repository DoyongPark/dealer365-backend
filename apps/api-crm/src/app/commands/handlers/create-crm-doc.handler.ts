import { CrmRepository } from "@dealer365-backend/database"; 
import { UserContextService } from "@dealer365-backend/nest";
import { UserContext } from "@dealer365-backend/shared";
import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CrmDocCreatedEvent, CrmEventBus } from "../../events";
import { CreateCrmDocCommand } from "../impl/create-crm-doc.command";

@CommandHandler(CreateCrmDocCommand)
export class CreateCrmDocHandler implements ICommandHandler<CreateCrmDocCommand> {

  private readonly logger = new Logger(this.constructor.name);
  
  constructor(
    private readonly repository: CrmRepository,
    private readonly eventBus: CrmEventBus,
  ) { }

  async execute(command: CreateCrmDocCommand) {

    const user = UserContextService.get<UserContext>();

    this.logger.debug(`user context: ${JSON.stringify(user)}`);

    const { data } = command;

    // Repository 중복 조회?
    const exists = await this.repository.findByName(data.name);

    // if (exists)
    //   throw new Error('Duplicated');

    // Doc Id 생성
    const newId = this.repository.createObjectId();

    // Doc 생성 이벤트 발생
    await this.eventBus.publish(new CrmDocCreatedEvent(newId, data));

    data['_id'] = newId;//to-do: _id필드를 써야 할까?
    await this.repository.create({ ...data });

    // Doc Id 리턴
    return { _id: newId };
  }
}