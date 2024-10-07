export class CrmDocUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly data: any
  ) { }
}
