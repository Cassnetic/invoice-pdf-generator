# Invoice PDF Generator

A small web app for making quotations, invoices and receipts as PDFs. Fill in the form, watch the preview update, download the PDF. Everything runs in the browser: no database, no account, and your business details never leave your machine.

We built it at [Cassnetic Tech](https://cassnetic.com) for our own quotes and invoices. It is written with Nuxt 4, Nuxt UI and jsPDF.

## What it does

- Three document types: quotation, invoice and receipt
- Your business details, an optional logo, and the client's details
- Line items with automatic subtotal, tax (for example SST or VAT) and discount
- MYR and USD currencies
- Payment terms with a deposit percentage, bank details and a payment reference on invoices
- A "prepared by" signature line on quotations
- A live PDF preview and a one-click download
- Saved templates in the browser's local storage

## Run it locally

You need Node 20 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Run it with Docker

```bash
docker build -t invoice-pdf-generator .
docker run -p 3000:3000 invoice-pdf-generator
```

## Change the defaults

The sample business and client details live at the top of each form component in `app/components/` (`QuotationForm.vue`, `InvoiceForm.vue`, `ReceiptForm.vue`). Put your own details there if you want them pre-filled. The PDF layout is in `app/composables/use*Pdf.ts`.

## Licence

MIT. See [LICENSE](LICENSE).

Need something like this built for your business? [Cassnetic Tech](https://cassnetic.com) builds web apps, automation and AI tools.
