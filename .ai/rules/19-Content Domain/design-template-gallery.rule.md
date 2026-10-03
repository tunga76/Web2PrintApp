# Design Template Gallery Rules (Web-To-Print)

## Core Principles

- **Templates as Content:** In a Web-to-Print platform, pre-designed templates (e.g., "Real Estate Business Card", "Minimalist Wedding Invitation") act as high-value content. They inspire customers, lower the barrier to purchase (solving the "blank canvas" syndrome), and act as powerful SEO magnets.
- **Decoupled from Products:** A single template design (e.g., a specific floral artwork) should be attachable to multiple physical products (e.g., Mugs, T-Shirts, and Canvas Prints) rather than being hardcoded to just one SKU.

## Taxonomy & Categorization

- **Industry & Theme Tags:** Templates must be categorized independently of physical products. Use taxonomies like Industry (Real Estate, Medical, Food), Theme (Minimalist, Vintage, Modern), and Occasion (Wedding, Birthday).
- **Searchability:** The platform must include a dedicated "Template Gallery" page equipped with faceted search (filtering by color, industry, style, orientation) to help users find inspiration quickly.

## SEO Strategy

- **Dedicated Landing Pages:** Every individual template MUST have its own indexable detail page with a unique, SEO-friendly URL (e.g., `/templates/business-cards/real-estate-gold-accent`). 
- **Rich Meta Data:** Template pages must generate dynamic Meta Titles, Descriptions, and OpenGraph/Twitter card images showing a beautiful mockup of the template to drive organic and social media traffic.

## Editor Integration

- **"Customize This" Workflow:** When a user clicks "Customize" on a template page, the system must launch the Web-to-Print Canvas Editor, passing the `TemplateId`. The editor must automatically load all vector elements, text layers, and background images defined by that template.
- **Placeholder Replacement:** Text layers in templates should act as smart placeholders (e.g., `[Company Name]`, `[Phone Number]`). The system can optionally prompt the logged-in user to fill out a quick form (or pull from their B2B profile) to auto-populate the canvas before it even opens.
