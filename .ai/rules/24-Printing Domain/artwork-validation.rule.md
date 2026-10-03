# Artwork Validation Rules

## Core Principles

- **File Formats:** Strictly limit uploads to print-safe formats (PDF is king; TIFF, high-res JPEG/PNG for basic prints). Block Word/PowerPoint unless a server-side conversion engine is guaranteed to be accurate.
- **Asynchronous Processing:** Large PDF uploads must be processed asynchronously. The user uploads, the UI shows "Validating...", and a background worker inspects the file, returning success or error reports.
