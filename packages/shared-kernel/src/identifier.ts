export type Identifier<Kind extends string> = string & {
  readonly __identifierKind: Kind;
};

export type SiteId = Identifier<'SiteId'>;
export type TenantId = Identifier<'TenantId'>;
export type CustomerId = Identifier<'CustomerId'>;
export type CorrelationId = Identifier<'CorrelationId'>;
export type BusinessRecordId = Identifier<'BusinessRecordId'>;

function createIdentifier<Kind extends string>(value: string, kind: Kind): Identifier<Kind> {
  if (value.trim().length === 0 || value !== value.trim()) {
    throw new TypeError(`${kind} must be a non-empty string without surrounding whitespace`);
  }

  return value as Identifier<Kind>;
}

export const siteId = (value: string): SiteId => createIdentifier(value, 'SiteId');
export const tenantId = (value: string): TenantId => createIdentifier(value, 'TenantId');
export const customerId = (value: string): CustomerId => createIdentifier(value, 'CustomerId');
export const correlationId = (value: string): CorrelationId =>
  createIdentifier(value, 'CorrelationId');
export const businessRecordId = (value: string): BusinessRecordId =>
  createIdentifier(value, 'BusinessRecordId');
