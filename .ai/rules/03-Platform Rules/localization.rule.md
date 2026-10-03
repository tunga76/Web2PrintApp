# Localization & Internationalization (i18n) Rules

## Core Principles

- **No Hardcoded Strings:** Never hardcode user-facing text in the codebase. Extract UI strings to the localization mechanism selected by the application (for example, JSON dictionaries or `next-intl`).
- **Locale Context:** The application must identify the user's preferred language/locale via URL (e.g., `/en-US/`), HTTP headers (`Accept-Language`), or user profile settings.

## Data Localization

- Support multi-language content in the database for dynamic data (e.g., Product Names, Descriptions). Use a separate translation table pattern or JSON/JSONB columns to store localized strings depending on querying needs.

## Formatting

- **Dates and Numbers:** Always format dates, times, numbers, and currencies according to the active locale, not the server's locale.
- **Pluralization:** Ensure the i18n library supports pluralization rules correctly for all target languages, as pluralization logic varies wildly across languages.
