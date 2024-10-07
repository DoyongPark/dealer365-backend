import { ICommand } from "@nestjs/cqrs";
import { CrmDocDto } from "../../dtos";

export class UpdateCrmDocCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: Partial<CrmDocDto>
  ) { }
}
