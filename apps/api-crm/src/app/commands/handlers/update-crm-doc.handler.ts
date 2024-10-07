import { CrmRepository } from "@dealer365-backend/database";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CrmEventBus } from "../../events";
import { CrmDocUpdatedEvent } from "../../events/crm-doc-updated.event";
import { UpdateCrmDocCommand } from "../impl/update-crm-doc.command";

@CommandHandler(UpdateCrmDocCommand)
export class UpdateCrmDocHandler implements ICommandHandler<UpdateCrmDocCommand> {
  constructor(
    private readonly repository: CrmRepository,
    private readonly eventBus: CrmEventBus,
  ) { }

  async execute(command: UpdateCrmDocCommand) {

    const { id, data } = command;

    // Repository 유무 확인
    const product = await this.repository.findById(id);

    // Doc 생성 이벤트 발생
    await this.eventBus.publish(new CrmDocUpdatedEvent(id, data));

    // Doc Id 리턴
    return { _id: id };
  }
}