# Dependency Management Rules

## Core Principles

- **Open Source Priority:** Strictly adhere to the Open Source Framework Policy. Do not introduce commercial or proprietary dependencies if an OSS alternative exists.
- **Minimalism:** Do not add a dependency for a trivial function that can be easily written and maintained in-house. Every dependency is a potential security risk and maintenance burden.

## Evaluation Criteria

Before adding a new package (NPM or the package manager selected by the project), evaluate:
1. **License:** Is it MIT, Apache-2.0, or BSD?
2. **Maintenance:** Is the project actively maintained? When was the last commit/release?
3. **Adoption:** Does it have a healthy community (stars, downloads, issues resolved)?
4. **Size/Impact:** Does it bloat the frontend bundle size or backend memory footprint?

## Versioning

- Use strict versions or specific ranges (`~` or `^`) for NPM dependencies. Lock files (`package-lock.json`, `pnpm-lock.yaml`) MUST be committed.
- Use the selected Node.js package manager consistently. Commit its lockfile and keep dependencies updated through reviewed changes.

## Security Scanning

- CI/CD pipelines MUST include dependency vulnerability scanning appropriate to the selected package manager. Define severity thresholds and a documented process for evaluating findings before making the scan a merge gate.
