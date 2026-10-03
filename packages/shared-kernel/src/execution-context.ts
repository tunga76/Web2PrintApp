import type {
  ActorId,
  CorrelationId,
  SiteId,
  TenantId,
} from './identifier.js';

export type ActorKind = 'customer' | 'staff' | 'system';

export interface ActorReference {
  readonly kind: ActorKind;
  readonly id: ActorId;
}

export interface ExecutionContext {
  readonly actor: ActorReference;
  readonly siteId: SiteId;
  readonly tenantId?: TenantId;
  readonly correlationId: CorrelationId;
}
