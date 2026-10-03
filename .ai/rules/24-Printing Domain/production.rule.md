# Production Rules

## Core Principles

- **Order to Job Conversion:** A customer's `OrderLineItem` translates to a `PrintJob` in the production domain.
- **Imposition (Montaj):** The system must know if a job is to be printed solo (dedicated run) or combined with other customers' jobs on a large sheet (Gang-run / Ortak Montaj) to save costs. Gang-run jobs require matching paper type, weight, and quantity groups.
- **Job Preparation:** Before printing, the "Job Preparation" queue must be completed. This includes:
  - **File Upload:** Customer uploads the final print file.
  - **File Approval:** A production staff member must check for errors (CMYK, bleed, resolution).
  - **Imposition:** Determining the print layout (gang-run or solo).
  - **Proofing:** Generating a PDF proof for the customer to sign off on.

## Production Workflow

The `production` module orchestrates the lifecycle of a print job.

### Key Entities

- **ProductionWorkflow**: Defines the step-by-step process (e.g., "Standard Business Card", "Premium Flyer").
- **ProductionJob**: A specific instance of a job being processed.
- **JobStatus**: Tracks the current stage (Pending, In Review, Approved, Printing, Completed).
- **ImpositionType**: Enum for `SOLO` (dedicated sheet) or `GANG_RUN` (combined with others).
- **PrintRun**: Physical production batch (groups of jobs run together).

### Job Lifecycle States

1. **PENDING_UPLOAD**: Order placed, awaiting customer artwork.
2. **IN_REVIEW**: Artwork received, production staff inspecting.
3. **APPROVED_BY_PRODUCTION**: Files checked and approved for print.
4. **READY_TO_PRINT**: Final proof approved, waiting for press time.
5. **PRINTING**: Running on the press.
6. **COMPLETED**: Printed and moved to finishing.
7. **CANCELLED**:

### "Smart Job Creation" Logic

When an order is paid, the system must intelligently group items into `PrintRuns`:

**1. Gang-Run Priority:**
   - Check if there are other pending jobs with the **exact** same: `Paper`, `GSM` (Grammage), `Size`, `Finishing`, and `Quantity` (or quantity group).
   - **Example:** Job A (250 qty) + Job B (250 qty) can be combined into a single `PrintRun` of 500.

**2. Solo Priority:**
   - If no matching jobs exist, create a `PrintRun` for the single job.
   - **Note:** Even solo jobs might be "scheduled" later if a machine is busy.

**3. Quantity Grouping:**
   - If a customer orders 250 units of a business card, they might receive them in 5 batches of 50 due to gang-run constraints. The system must calculate how many `PrintRuns` are needed to fulfill the total quantity.
