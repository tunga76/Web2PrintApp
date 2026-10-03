# Web-To-Print Specific Analytics Rules

## Core Principles

- **Beyond Standard E-Commerce:** Standard conversion funnels (Visits -> Cart -> Checkout) are insufficient for Web-To-Print platforms. The system must track the complex friction points unique to custom manufacturing (e.g., design editor struggles, file upload failures).
- **Manufacturing KPIs:** Analytics must track factory efficiency (SLA adherence, material yield) just as rigorously as sales and marketing metrics.

## Frontend & Editor Telemetry

- **Canvas Drop-off Rate:** The system must track exactly when users abandon the Web-based Canvas Editor. (e.g., Did they leave after 5 minutes of struggling with text alignment? Did they leave immediately after opening a blank canvas?). This helps determine if the UX is too complex.
- **Template Conversion Rate:** Track which pre-designed templates generate the most revenue. (e.g., "Template A was opened 1,000 times but only purchased 10 times, whereas Template B has a 50% purchase rate"). This dictates the content strategy.

## Pre-Flight & File Upload Metrics

- **Pre-Flight Failure Rate:** Track the percentage of uploaded customer PDFs that fail automatic validation. 
- **Top Rejection Reasons:** The Admin analytics dashboard must aggregate the most common reasons for file rejection (e.g., "80% of failures are due to RGB color space, 15% due to Low DPI"). This data drives business decisions to improve UI instructions or tooltips.

## Factory & Production Metrics (SLA)

- **SLA Breach Rate (Gecikme Oranı):** Measure the time between the order moving to `InProduction` and `Shipped`. Track the exact percentage of orders that miss their promised delivery window.
- **Reprint / Defect Rate (Hata Oranı):** Track how often an order is cloned for a `Reprint` due to a factory error versus a customer error. This is the ultimate metric for measuring factory quality control.
- **Material Wastage (Fire Oranı):** If tracking imposition (Ganging), the system should log the percentage of unused white space on the large master sheets (Blank Space = Wasted Money) to evaluate the efficiency of the prepress algorithms.
