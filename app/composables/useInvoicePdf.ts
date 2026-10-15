/**
 * Composable for generating and downloading professional invoices
 * Uses jsPDF for client-side PDF generation
 * Follows industry best practices for invoice formatting
 */

import { formatDate, formatCurrency } from "./useDateUtils";
import { addFooterToAllPages } from "./useFooter";

// Define proper types for invoice data
interface InvoiceItem {
  description: string;
  total: number;
}

interface Invoice {
  businessName: string;
  businessAddressLine1?: string;
  businessAddressLine2?: string;
  businessAddressLine3?: string;
  businessAddressLine4?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessLicense?: string;
  website?: string;
  clientCompanyName?: string;
  clientName: string;
  clientAddressLine1?: string;
  clientAddressLine2?: string;
  clientAddressLine3?: string;
  clientAddressLine4?: string;
  clientEmail?: string;
  clientPhone?: string;
  invoiceNumber: string;
  date?: string;
  dueDate?: string;
  currency: string;
  logo?: string | null;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: string;
  taxAmount?: number;
  discountRate?: string;
  discountAmount?: number;
  totalAmount: number;
  paymentTerms?: string;
  notes?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftCode?: string;
  };
  paymentReference?: string;
  customFooterText?: string;
}

export const useInvoicePdf = () => {
  /**
   * Generates a professional PDF invoice from the provided invoice data
   * @param invoice - The invoice data to generate PDF from
   * @returns Promise<Blob> - The generated PDF as a blob
   */
  const generatePDF = async (invoice: Invoice): Promise<Blob> => {
    // Dynamic import of jsPDF to avoid SSR issues
    const { default: jsPDF } = await import("jspdf");

    // Create new PDF document
    const doc = new jsPDF();

    // Document settings
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15; // Match quotation exactly
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper to check for new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper to wrap text
    const wrapText = (text: string | undefined, maxWidth: number): string[] => {
      if (!text) return [""];
      const lines: string[] = [];
      text.split("\n").forEach((paragraph) => {
        const words = paragraph.split(" ");
        let currentLine = "";
        words.forEach((word) => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const { w: testWidth } = doc.getTextDimensions(testLine);
          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine) lines.push(currentLine);
      });
      return lines.length > 0 ? lines : [""];
    };

    // ===== HEADER SECTION =====
    // Business Information (left side)
    const businessInfoStartY = yPos;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.businessName || "Business Name", margin, yPos + 5);
    yPos += 13;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    const addressLines = [
      invoice.businessAddressLine1,
      invoice.businessAddressLine2,
      invoice.businessAddressLine3,
      invoice.businessAddressLine4,
    ].filter(Boolean);

    addressLines.forEach((line) => {
      wrapText(line, contentWidth / 2 - margin).forEach((wrappedLine) => {
        doc.text(wrappedLine, margin, yPos);
        yPos += 4.5;
      });
    });

    if (invoice.businessEmail) {
      doc.text(`Email: ${invoice.businessEmail}`, margin, yPos);
      yPos += 4.5;
    }
    if (invoice.businessPhone) {
      doc.text(`Office: ${invoice.businessPhone}`, margin, yPos);
      yPos += 4.5;
    }
    if (invoice.businessLicense) {
      doc.text(`Business No: ${invoice.businessLicense}`, margin, yPos);
      yPos += 4.5;
    }
    if (invoice.website) {
      doc.text(`Website: ${invoice.website}`, margin, yPos);
      yPos += 4.5;
    }

    // Business Logo (right side, centered with business info)
    const businessInfoEndY = yPos;
    const businessInfoCenterY = businessInfoStartY + (businessInfoEndY - businessInfoStartY) / 2;

    if (invoice.logo) {
      try {
        // Create a promise to handle image loading
        await new Promise<void>((resolve, reject) => {
          const img = new Image();

          img.onload = () => {
            try {
              const logoWidth = 40;
              const logoHeight = 40;
              // Position logo on the right side, centered with business info
              const logoX = pageWidth - margin - logoWidth;
              const logoY = businessInfoCenterY - logoHeight / 2; // Center vertically with business info
              doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);
              resolve();
            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () => {
            reject(new Error('Failed to load logo image'));
          };

          img.src = invoice.logo || '';
        });
      } catch {
        // Continue without logo if loading fails
      }
    }

    // Add spacing after business info (match quotation exactly)
    yPos += 5;

    // Add horizontal line above title (match quotation exactly)
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Invoice Title - Centered like quotation (match quotation exactly)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("INVOICE", pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    // Create bordered box with two columns like quotation - match quotation exactly
    const boxY = yPos;
    const boxWidth = pageWidth - (margin * 2); // Match the line width above
    const boxHeight = 40; // Match quotation height
    const boxX = margin; // Align with the line above

    // Draw the main box (match quotation exactly)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(boxX, boxY, boxWidth, boxHeight);

    // Draw vertical line to separate columns (match quotation exactly)
    const verticalLineX = boxX + boxWidth / 2;
    doc.line(verticalLineX, boxY, verticalLineX, boxY + boxHeight);

    // Left column - Client information (match quotation exactly)
    const leftColumnX = boxX + 5; // Match quotation padding
    const rightColumnX = verticalLineX + 5; // Match quotation padding
    let currentY = boxY + 8; // Match quotation padding

    // Client header (match quotation exactly)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Bill To:", leftColumnX, currentY);
    currentY += 6; // Match quotation spacing
    doc.text(invoice.clientCompanyName || "Client Company", leftColumnX, currentY);
    currentY += 6; // Match quotation spacing

    // Client details (match quotation exactly)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    if (invoice.clientPhone) {
      doc.text(`TEL: ${invoice.clientPhone}`, leftColumnX, currentY);
      currentY += 5; // Match quotation spacing
    }
    doc.text(`Attention: ${invoice.clientName}`, leftColumnX, currentY);
    currentY += 5; // Match quotation spacing
    if (invoice.clientEmail) {
      doc.text(`Email: ${invoice.clientEmail}`, leftColumnX, currentY);
    }

    // Right column - Invoice details (match quotation exactly)
    currentY = boxY + 8; // Reset Y for right column
    const labelX = rightColumnX;
    const valueX = rightColumnX + 25; // Match quotation spacing

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("No. :", labelX, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.invoiceNumber, valueX, currentY);
    currentY += 7; // Match quotation spacing

    doc.setFont("helvetica", "normal");
    doc.text("Date :", labelX, currentY);
    doc.text(formatDate(invoice.date || ""), valueX, currentY);
    currentY += 7; // Match quotation spacing

    if (invoice.dueDate) {
      doc.text("Due :", labelX, currentY);
      doc.text(formatDate(invoice.dueDate), valueX, currentY);
      currentY += 7; // Match quotation spacing
    }

    doc.text("Page :", labelX, currentY);
    doc.text("1 of 1", valueX, currentY);

    // Ensure proper spacing before items section (reduce gap)
    yPos = boxY + boxHeight + 10;

    // Client information is now in the bordered box above, so we skip the separate section

    // ===== INVOICE ITEMS TABLE =====
    if (invoice.items && invoice.items.length > 0) {
      const tableHeaderY = yPos;

      // Table header (match quotation exactly)
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, tableHeaderY, contentWidth, 10, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50);

      doc.text("Item", margin + 5, tableHeaderY + 7);
      doc.text("Description", margin + 25, tableHeaderY + 7);
      doc.text("Total", pageWidth - margin - 2, tableHeaderY + 7, { align: "right" });

      yPos += 12;

      // Table rows (match quotation exactly)
      let subtotal = 0;
      invoice.items.forEach((item, index) => {
        if (!item) return;
        const LINE_HEIGHT = 5;
        const descriptionWidth = contentWidth - 65;
        const descriptionLines = wrapText(
          item.description || "",
          descriptionWidth
        );
        const rowHeight = Math.max(
          15,
          descriptionLines.length * LINE_HEIGHT + 6
        );
        checkNewPage(rowHeight);
        const rowStartY = yPos;
        const contentY = rowStartY + 8;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(String(index + 1) + ".", margin + 5, contentY);
        let currentDescY = contentY;
        descriptionLines.forEach((line) => {
          doc.text(line, margin + 25, currentDescY);
          currentDescY += LINE_HEIGHT;
        });
        const itemTotal = item.total || 0;
        subtotal += itemTotal;
        doc.text(
          formatCurrency(itemTotal, invoice.currency),
          pageWidth - margin,
          contentY,
          { align: "right" }
        );
        yPos = rowStartY + rowHeight;

        // Row separator
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 2;
      });

      yPos += 10;

      // ===== TOTALS SECTION =====
      const totalsX = pageWidth - margin; // Move to right end of page
      const totalsY = yPos;

      // No background color for totals section

      // Only show subtotal if there are discounts or taxes
      const hasDiscount = invoice.discountAmount && invoice.discountAmount > 0;
      const hasTax = invoice.taxAmount && invoice.taxAmount > 0;

      if (hasDiscount || hasTax) {
        // Subtotal
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", totalsX - 30, totalsY, { align: "right" });
        doc.text(formatCurrency(subtotal, invoice.currency), totalsX, totalsY, { align: "right" });
        yPos += 6;
      }

      // Discount (if applicable)
      if (hasDiscount) {
        doc.text(`Discount (${invoice.discountRate || "0"}%):`, totalsX - 30, yPos, { align: "right" });
        doc.text(`-${formatCurrency(invoice.discountAmount || 0, invoice.currency)}`, totalsX, yPos, { align: "right" });
        yPos += 6;
      }

      // Tax (if applicable)
      if (hasTax) {
        doc.text(`Tax (${invoice.taxRate || "0"}%):`, totalsX - 30, yPos, { align: "right" });
        doc.text(formatCurrency(invoice.taxAmount || 0, invoice.currency), totalsX, yPos, { align: "right" });
        yPos += 6;
      }

      // Total
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Total: ", totalsX - 30, yPos, { align: "right" });
      doc.text(formatCurrency(invoice.totalAmount, invoice.currency), totalsX, yPos, { align: "right" });
      yPos += 15;
    }

    // Calculate required space for payment sections (keep them together)
    let requiredPaymentHeight = 0;

    // Payment Terms height
    if (invoice.paymentTerms) {
      requiredPaymentHeight += 6; // "Payment Terms:" header
      requiredPaymentHeight += wrapText(invoice.paymentTerms, contentWidth).length * 5; // Description lines
      requiredPaymentHeight += 10; // Bottom spacing
    }

    // Payment Details height
    if (invoice.bankDetails) {
      requiredPaymentHeight += 7; // "Payment Details:" header
      requiredPaymentHeight += 6; // "Please transfer payment to:" line
      requiredPaymentHeight += 5; // Bank details (3 lines)
      if (invoice.bankDetails.swiftCode) {
        requiredPaymentHeight += 5; // SWIFT code line
      }
      if (invoice.paymentReference) {
        requiredPaymentHeight += 5; // Reference line
      }
      requiredPaymentHeight += 10; // Bottom spacing
    }

    // Check if we need a new page for payment sections
    // Only break to new page if we really don't have enough space (leave room for footer)
    if (yPos + requiredPaymentHeight > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }

    // ===== PAYMENT TERMS =====
    if (invoice.paymentTerms) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Terms:", margin, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      wrapText(invoice.paymentTerms, contentWidth).forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 10;
    }

    // ===== PAYMENT DETAILS =====
    if (invoice.bankDetails) {

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Details:", margin, yPos);
      yPos += 7;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Please transfer payment to:", margin, yPos);
      yPos += 6;

      const bankDetails = [
        `Bank: ${invoice.bankDetails.bankName}`,
        `Account Number: ${invoice.bankDetails.accountNumber}`,
        `Account Name: ${invoice.bankDetails.accountName}`,
      ];

      if (invoice.bankDetails.swiftCode) {
        bankDetails.push(`SWIFT Code: ${invoice.bankDetails.swiftCode}`);
      }

      if (invoice.paymentReference) {
        bankDetails.push(`Reference: ${invoice.paymentReference}`);
      }

      bankDetails.forEach((detail) => {
        doc.text(detail, margin, yPos);
        yPos += 5;
      });

      yPos += 10;
    }

    // ===== FOOTER =====
    addFooterToAllPages(doc, {
      customText: invoice.customFooterText,
      margin,
      pageWidth,
      pageHeight,
    });

    return doc.output("blob");
  };

  /**
   * Downloads the generated PDF invoice
   * @param invoice - The invoice data
   * @param filename - Optional filename for the download
   */
  const downloadPDF = async (invoice: Invoice, filename?: string) => {
    try {
      const blob = await generatePDF(invoice);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `document-${invoice.invoiceNumber || "001"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      throw new Error("Failed to generate invoice PDF");
    }
  };


  /**
   * Calculates invoice totals
   * @param items - Array of invoice items
   * @param taxRate - Tax rate percentage
   * @param discountRate - Discount rate percentage
   * @returns Object with calculated totals
   */
  const calculateTotals = (items: InvoiceItem[], taxRate: number = 0, discountRate: number = 0) => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0);

    const discountAmount = (subtotal * discountRate) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const totalAmount = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount
    };
  };

  return {
    generatePDF,
    downloadPDF,
    calculateTotals,
  };
};
