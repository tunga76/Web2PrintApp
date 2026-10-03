# CMYK Validation Rules

## Core Principles

- **Color Space:** Printing presses operate in CMYK. Customer screens are RGB.
- **Conversion:** If a user uploads an RGB file, the backend preflight engine must convert it to a standard CMYK profile (e.g., FOGRA39 or SWOP) *before* rendering the preview, so the customer sees the duller, accurate color shift.
- **Total Ink Coverage (TIC):** Warn or reject files if the combined CMYK ink values exceed press limits (usually > 300-320%), which causes ink smearing.
- **Rich Black:** Ensure small text is set to 100% K (Black) rather than Rich Black (CMYK mix) to prevent registration issues (blurry text) on offset presses.
