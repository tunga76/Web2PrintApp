import type { BusinessRecordId, EventId, Identifier } from './identifier.js';

/** In-process business fact. Integration-event delivery belongs to infrastructure. */
export interface DomainEvent<
  Name extends string = string,
  Aggregate extends Identifier<string> = BusinessRecordId,
> {
  readonly eventId: EventId;
  readonly eventName: Name;
  readonly occurredAt: Date;
  readonly aggregateId: Aggregate;
}
