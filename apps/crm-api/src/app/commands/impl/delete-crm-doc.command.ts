import { ICommand } from "@nestjs/cqrs";

export class DeleteCrmDocCommand implements ICommand {
  constructor(
    public readonly id: string
  ) {}
}
