# Notification Template Rules

## Core Principles

- **Decoupling Content from Code:** Developers should not hardcode email HTML, SMS text, or push titles in backend or frontend application code.
- **Template Engine:** Use a robust template engine (e.g., Handlebars, Razor, Liquid) to render messages dynamically by merging raw data (e.g., Order JSON) with the template.

## Multi-Language and Storage

- **Localization:** Templates must be locale-aware. If the user's preferred language is `tr-TR`, the system must load the Turkish version of the "Order_Confirmed" template.
- **CMS/Database Storage:** Store templates in the database or a Headless CMS so that marketing and operations teams can modify the copy without requiring a software deployment.
