import { CrmRepository } from "@dealer365-backend/database";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CrmEventBus } from "../../events";
import { CrmDocDeletedEvent } from "../../events/crm-doc-deleted.event";
import { DeleteCrmDocCommand } from "../impl/delete-crm-doc.command";

@CommandHandler(DeleteCrmDocCommand)
export class DeleteCrmDocHandler implements ICommandHandler<DeleteCrmDocCommand> {
  constructor(
    private readonly repository: CrmRepository,
    private readonly eventBus: CrmEventBus,
  ) { }

  async execute(command: DeleteCrmDocCommand) {

    const { id } = command;

    // Repository 유무 확인
    const doc = await this.repository.findById(id);

    // Doc 생성 이벤트 발생
    await this.eventBus.publish(new CrmDocDeletedEvent(id));

    // Doc Id 리턴
    return { _id: id };
  }
}