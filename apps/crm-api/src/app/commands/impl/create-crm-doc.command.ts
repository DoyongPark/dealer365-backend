import { ICommand } from "@nestjs/cqrs";
import { CrmDocDto } from "../../dtos";

export class CreateCrmDocCommand implements ICommand {
  constructor(
    public readonly data: Partial<CrmDocDto>
  ) { }
}
