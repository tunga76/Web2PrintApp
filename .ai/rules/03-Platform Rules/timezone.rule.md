# Timezone & Date Handling Rules

## Core Principles

- **Store in UTC:** All dates and times MUST be stored in the database in Coordinated Universal Time (UTC).
- **Backend Processing:** All backend business logic, calculations (e.g., campaign expiration), and server-side logging MUST use UTC.

## Displaying Time

- **Client-Side Conversion:** Convert UTC times to the user's local timezone only at the presentation layer (UI). Use standard libraries (e.g., `date-fns`, `Intl.DateTimeFormat`) to handle timezones on the frontend.
- **User Preference:** Allow users to set a preferred timezone in their profile if the application handles scheduling or time-sensitive data that differs from their physical browser location.

## Specific Edge Cases

- **"Date Only" Data:** For fields that represent a date without a specific time (e.g., Date of Birth), be careful not to shift the date back or forward when converting across timezones. Store them strictly as a Date type without time context if possible, or midnight UTC.
