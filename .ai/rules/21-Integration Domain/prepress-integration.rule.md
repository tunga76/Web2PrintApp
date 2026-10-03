# Prepress and Machine Integration Rules (Web-To-Print)

## Core Principles

- **Zero-Touch Manufacturing:** The ultimate goal of a Web-to-Print integration is to push a customer-approved print file directly to the printing presses (or prepress automation software) without requiring a human operator to manually download and move files.
- **Separation of Concerns:** ERP integrations (SAP, Logo, Nebim) handle financial and inventory data; Prepress integrations exclusively handle manufacturing data (PDF files, Job Tickets).

## File Transfer Mechanisms

- **Hot Folders (SFTP/FTP):** The most common integration method for digital presses (e.g., HP Indigo, Xerox, Konica Minolta) is the "Hot Folder". The platform must support automatically pushing print-ready PDFs to a secured SFTP server located on the factory's local network once the order reaches `InProduction`.
- **Strict Naming Conventions:** Files dropped into a Hot Folder MUST follow a strict, human-readable naming convention. Random UUIDs are unacceptable because floor operators rely on filenames.
  - *Standard Format:* `[OrderNumber]-[LineItemNumber]_[Quantity]x_[MaterialCode]_[Dimensions].pdf`
  - *Example:* `ORD10495-L2_500x_350G-MATTE_90x50mm.pdf`

## Advanced Prepress API (JDF/JMF)

- **Job Definition Format (JDF):** For advanced prepress automation (e.g., Enfocus Switch, Fiery, Kodak Prinergy), the platform should generate an XML-based JDF ticket alongside the PDF. This ticket programmatically instructs the prepress software on how to impose (gang), color-correct, and route the specific job.
- **Status Callbacks (JMF):** The prepress software should be able to ping a Webhook (JMF/REST API) back to the Web-To-Print platform when the file is successfully ripped (RIP) or when it is physically printed, thereby advancing the online order status to `QualityControl` automatically.

## Failure Handling

- **Queue & Retry Logic:** If the factory's local SFTP server goes offline or the prepress API times out, the system must queue the file transfer and implement robust exponential backoff retry logic.
- **Alerting:** If a print file fails to transfer after multiple attempts, the system must trigger a `HighPriority` alert to the factory floor manager to prevent the order from being silently lost.
