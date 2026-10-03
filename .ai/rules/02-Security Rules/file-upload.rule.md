# File Upload Security Rules

## Core Principles

- **Never Trust User Files:** Web-to-Print applications heavily rely on user-uploaded files (PDF, PNG, JPG, AI). These are prime vectors for malware, reverse shells, and path traversal attacks.

## Validation & Verification

- **Magic Byte Verification:** Do not rely on file extensions (e.g., `.pdf` or `.jpg`) or the `Content-Type` header sent by the client. Always verify the file's true MIME type by reading its magic bytes (file signature) on the backend.
- **File Size Limits:** Enforce strict file size limits globally (via Reverse Proxy / Kestrel) and per-feature to prevent Denial of Service (DoS) attacks.
- **Allowed Types (Allowlist):** Only allow specific, required file types. Never use blocklists. 

## Storage & Processing

- **Isolated Storage:** Never store user-uploaded files directly on the local file system where the application is hosted. Use isolated Object Storage (e.g., AWS S3, Azure Blob Storage, MinIO).
- **No Execution:** Ensure that the directory or storage bucket where files are saved does not have execution privileges. 
- **Randomized File Names:** Never save files using the user's original file name to prevent Path Traversal attacks and overwriting. Generate a secure random ID (e.g., UUID/ULID) for the file name.

## Security Scanning

- **Antivirus Integration:** If possible, integrate a virus scanner (like ClamAV) for all incoming files before they are processed by the printing/rendering engine.
- **Safe Rendering:** Since rendering engines (like ImageMagick or PDF parsers) can have vulnerabilities, process files in isolated, sandboxed environments or serverless functions when extracting thumbnails or pre-flighting files.
