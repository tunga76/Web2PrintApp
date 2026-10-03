# PDF Preflight Rules

## Core Principles

- **Automated Inspection:** Before a file reaches the printing press, it MUST undergo automated preflight (e.g., via Enfocus PitStop Server, callas pdfToolbox, or Ghostscript wrappers).
- **Checklist:**
  - Verify Resolution (>= 300 DPI).
  - Verify Fonts are embedded or outlined.
  - Detect Transparency issues.
  - Verify Page count matches the product configuration.
  - Detect corrupt or password-protected PDFs.
- **Auto-Fix (Optional):** Define safe automated fixes (e.g., scaling a document proportionally by 2% to fit the bleed area) vs. hard errors that require the customer to upload a new file.
