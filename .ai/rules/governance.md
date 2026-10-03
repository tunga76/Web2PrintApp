# Rule Governance

## Scope and precedence

- Apply `master-rules.md` to feature work as a planning checklist. A checklist item applies only when relevant to the feature and the project supports that capability.
- Apply a domain rule only when the feature touches that domain. Apply platform-specific rules only when the corresponding platform, provider, or integration is in use.
- Security, privacy, financial integrity, and tenant isolation requirements take precedence over convenience and performance guidance.
- If rules conflict, follow the more specific rule that matches the active domain and documented architecture. Record unresolved conflicts as an issue and do not silently choose behavior that can affect money, data isolation, production, or legal obligations.

## Normative language

- **MUST / MUST NOT** identify hard requirements that apply within the stated scope.
- **SHOULD / SHOULD NOT** identify a recommended default. A deviation is acceptable when the reason and impact are documented.
- **MAY** identifies an optional approach.
- Examples, vendor names, and sample values are illustrative unless explicitly marked as a requirement for the deployed stack.
- Use conditional wording such as “when using …” for optional capabilities. Do not require a queue, cache, microservice, ORM, or cloud vendor when the project does not use it.

## Ownership and maintenance

- The engineering owner for the affected domain maintains its rules; security and privacy changes require review by the security owner, and legal or regulatory statements require review by the appropriate compliance owner.
- Every rule change must be reviewed with its affected domain owners and checked for conflicts with linked rules.
- Record the rule owner, last-verified date, and sources for time-sensitive provider, legal, regulatory, or standards claims in the relevant rule file.
- Review provider and legal claims before implementation and at least annually. If current documentation cannot be confirmed, mark the claim unverified and do not treat it as an unconditional requirement.

## Exceptions

- Document a deviation in the change record or an ADR with the rule, reason, affected scope, risk, mitigation, owner, and review or expiry date.
- Security, privacy, payment-integrity, and tenant-isolation requirements cannot be waived by a feature team; route proposed exceptions to the corresponding owner.
- Remove expired exceptions or renew them with a fresh review.

## Measurable targets

- A numeric performance or coverage target is enforceable only when its measurement method, environment, sample window, and threshold are stated.
- Treat targets without those details as goals, not merge-blocking gates.
- Coverage percentages apply only to executable code included by the configured coverage tool; generated code and justified exclusions must be listed explicitly.
