export class CrmDocCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly data: any
  ) { }
}
