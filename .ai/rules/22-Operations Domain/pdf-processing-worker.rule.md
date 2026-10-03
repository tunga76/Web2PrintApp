# PDF Processing and Heavy Compute Rules (Web-To-Print)

## Core Principles

- **Resource Isolation:** Processing print-ready files (PDFs, TIFFs, EPS) is extremely CPU and Memory intensive. Operations such as RGB to CMYK conversion, DPI analysis, flattening layers, or rendering 3D mockups MUST NEVER run on the main web/API servers.
- **Asynchronous by Default:** Due to the unpredictable time required to process large graphic files (some may take 2 seconds, others 2 minutes), all processing must be strictly asynchronous.

## Dedicated Worker Architecture

- **Message Queues:** When a user uploads a file or completes a canvas design, the API server must immediately save the raw file to cloud storage (e.g., AWS S3) and publish a message to a Message Queue (e.g., RabbitMQ, Kafka) containing the `FileId` and the requested action (e.g., `RunPreflightChecks`).
- **Dedicated Workers:** A separate cluster of backend Worker nodes (optimized for Compute and Memory) consumes these messages. These workers execute the heavy C++/Ghostscript/ImageMagick binaries to process the PDF safely.
- **Out of Memory (OOM) Protection:** Workers must be configured with hard memory limits and timeout policies (e.g., Max Execution Time: 60 seconds). If a highly complex or corrupted PDF causes the worker to freeze, the process must be killed and restarted without bringing down the storefront.

## Frontend Interaction (WebSockets / SignalR)

- **Real-Time Feedback:** The UI must not block via a spinning HTTP request waiting for the PDF to process. Instead, it should display an optimistic "Processing your file... Please wait" UI state.
- **Push Notifications:** Once the Backend Worker completes the PDF processing, it updates the database and pushes a real-time notification to the frontend via WebSockets (e.g., SignalR), triggering the UI to instantly display the final Print Preview Mockup or the Pre-flight errors.

## Dead Letter Queues (DLQ) & Error Handling

- **Handling Corrupt Files:** If a PDF cannot be processed after a defined number of retries (e.g., due to file corruption, missing fonts, or password protection), the message must be routed to a Dead Letter Queue (DLQ). 
- **User Alert:** The system must then automatically update the file status to `Failed` and alert the user (via the UI and Email) that their file is invalid/unreadable, prompting them for a fresh re-upload.
