/**
 * Composable for generating and downloading quotation PDFs
 * Uses jsPDF for client-side PDF generation
 */

import { formatDate, formatCurrency } from "./useDateUtils";
import { addFooterToAllPages } from "./useFooter";

// Define proper types for quotation data
interface QuotationItem {
  description: string;
  total: number;
}

interface Quotation {
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
  quotationNumber: string;
  date?: string;
  currency: string;
  validityDays?: string;
  logo?: string | null;
  items: QuotationItem[];
  subtotal: number;
  taxRate: string;
  taxAmount: number;
  discountRate: string;
  discountAmount: number;
  totalAmount: number;
  enablePaymentTerms: boolean;
  depositPercentage?: string;
  paymentTermsDescription?: string;
  customFooterText?: string;
  // Prepared by fields
  preparedByName?: string;
  preparedByDesignation?: string;
  // Signature fields
  enableSignatures: boolean;
}

export const useQuotationPdf = () => {
  /**
   * Generates a PDF quotation from the provided quotation data.
   * This version is updated to include `clientAddressLine4`.
   * @param quotation - The quotation data to generate PDF from
   * @returns Promise<Blob> - The generated PDF as a blob
   */
  const generatePDF = async (quotation: Quotation): Promise<Blob> => {
    // Dynamic import of jsPDF to avoid SSR issues
    const { default: jsPDF } = await import("jspdf");

    // Create new PDF document
    const doc = new jsPDF();

    // Document settings
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
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

    // ===== BUSINESS INFORMATION =====
    // Business Information (left side)
    const businessInfoStartY = yPos;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(quotation.businessName || "Business Name", margin, yPos + 5);
    yPos += 13;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const addressLines = [
      quotation.businessAddressLine1,
      quotation.businessAddressLine2,
      quotation.businessAddressLine3,
      quotation.businessAddressLine4,
    ].filter(Boolean);
    addressLines.forEach((line) => {
      wrapText(line, contentWidth / 2 - margin).forEach((wrappedLine) => {
        doc.text(wrappedLine, margin, yPos);
        yPos += 4.5;
      });
    });
    if (quotation.businessEmail) {
      doc.text(`Email: ${quotation.businessEmail}`, margin, yPos);
      yPos += 4.5;
    }
    if (quotation.businessPhone) {
      doc.text(`Office: ${quotation.businessPhone}`, margin, yPos);
      yPos += 4.5;
    }
    if (quotation.businessLicense) {
      doc.text(`Business No: ${quotation.businessLicense}`, margin, yPos);
      yPos += 4.5;
    }
    if (quotation.website) {
      doc.text(`Website: ${quotation.website}`, margin, yPos);
      yPos += 4.5;
    }

    // Business Logo (right side, centered with business info)
    const businessInfoEndY = yPos;
    const businessInfoCenterY = businessInfoStartY + (businessInfoEndY - businessInfoStartY) / 2;

    if (quotation.logo) {
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

          img.src = quotation.logo || '';
        });
      } catch {
        // Continue without logo if loading fails
      }
    }

    yPos += 5;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("QUOTATION", pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    // ===== CLIENT AND QUOTATION DETAILS SECTION =====
    const sectionStartY = yPos;
    const dividerX = margin + contentWidth / 2;

    // Dynamically calculate the height of the client/details box
    let clientHeight = 8;
    doc.setFontSize(9);

    // FIX: Add the new address line to this array
    const clientAddress = [
      quotation.clientAddressLine1,
      quotation.clientAddressLine2,
      quotation.clientAddressLine3,
      quotation.clientAddressLine4, // <-- ADD THIS LINE
    ].filter(Boolean);

    clientAddress.forEach((line) => {
      clientHeight += wrapText(line, contentWidth / 2 - 10).length * 4.5;
    });
    clientHeight += 2;
    if (quotation.clientPhone) clientHeight += 5;
    if (quotation.clientName) clientHeight += 5;
    if (quotation.clientEmail) clientHeight += 5;
    clientHeight += 8;
    let detailsHeight = 16 + 7 * 3;
    if (quotation.validityDays) detailsHeight += 7;
    const sectionHeight = Math.max(clientHeight, detailsHeight, 40);

    // Draw the box and render the content
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPos, contentWidth, sectionHeight);
    doc.line(dividerX, yPos, dividerX, yPos + sectionHeight);

    let clientY = yPos + 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(quotation.clientCompanyName || "Client Name", margin + 5, clientY);
    clientY += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    // The loop below will now automatically include the 4th address line
    clientAddress.forEach((line) => {
      wrapText(line, contentWidth / 2 - 10).forEach((wrappedLine) => {
        doc.text(wrappedLine, margin + 5, clientY);
        clientY += 4.5;
      });
    });

    clientY += 2;
    if (quotation.clientPhone) {
      doc.text(`TEL: ${quotation.clientPhone}`, margin + 5, clientY);
      clientY += 5;
    }
    if (quotation.clientName) {
      doc.text(`Attention: ${quotation.clientName}`, margin + 5, clientY);
      clientY += 5;
    }
    if (quotation.clientEmail) {
      doc.text(`Email: ${quotation.clientEmail}`, margin + 5, clientY);
    }

    let rightDetailsY = yPos + 8;
    const labelX = dividerX + 5;
    const valueX = labelX + 25;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("No. :", labelX, rightDetailsY);
    doc.setFont("helvetica", "bold");
    doc.text(quotation.quotationNumber || "QT-001", valueX, rightDetailsY);
    rightDetailsY += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Date :", labelX, rightDetailsY);
    doc.text(formatDate(quotation.date || ""), valueX, rightDetailsY);
    rightDetailsY += 7;
    if (quotation.validityDays) {
      doc.text("Valid for :", labelX, rightDetailsY);
      doc.text(`${quotation.validityDays} days`, valueX, rightDetailsY);
      rightDetailsY += 7;
    }
    doc.text("Page :", labelX, rightDetailsY);
    doc.text("1 of 1", valueX, rightDetailsY);
    yPos = sectionStartY + sectionHeight + 10;

    // (The rest of the file remains unchanged)
    // ...
    // ===== ITEMS TABLE =====
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for your business. We are pleased to submit our quotation as follows:",
      margin,
      yPos
    );
    yPos += 10;
    if (quotation.items && quotation.items.length > 0) {
      const tableHeaderY = yPos;
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, tableHeaderY, contentWidth, 10, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Item", margin + 5, tableHeaderY + 7);
      doc.text("Description", margin + 25, tableHeaderY + 7);
      doc.text("Price", pageWidth - margin - 2, tableHeaderY + 7, {
        align: "right",
      });
      yPos += 12;
      quotation.items.forEach((item, index) => {
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
        const itemPrice = item.total || 0;
        doc.text(
          formatCurrency(itemPrice, quotation.currency),
          pageWidth - margin,
          contentY,
          { align: "right" }
        );
        yPos = rowStartY + rowHeight;
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, yPos, pageWidth - margin, yPos);
      });

      // ===== TOTALS SECTION =====
      yPos += 10;
      const totalsX = pageWidth - margin; // Move to right end of page
      const totalsY = yPos;

      // No background color for totals section

      // Only show subtotal if there are discounts or taxes
      const hasDiscount = quotation.discountAmount > 0;
      const hasTax = quotation.taxAmount > 0;

      if (hasDiscount || hasTax) {
        // Subtotal
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", totalsX - 30, totalsY, { align: "right" });
        doc.text(formatCurrency(quotation.subtotal, quotation.currency), totalsX, totalsY, { align: "right" });
        yPos += 6;
      }

      // Discount (if any)
      if (hasDiscount) {
        doc.text(`Discount (${quotation.discountRate}%):`, totalsX - 30, yPos, { align: "right" });
        doc.text(`-${formatCurrency(quotation.discountAmount, quotation.currency)}`, totalsX, yPos, { align: "right" });
        yPos += 6;
      }

      // Tax (if any)
      if (hasTax) {
        doc.text(`Tax (${quotation.taxRate}%):`, totalsX - 30, yPos, { align: "right" });
        doc.text(formatCurrency(quotation.taxAmount, quotation.currency), totalsX, yPos, { align: "right" });
        yPos += 6;
      }

      // Total
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Total: ", totalsX - 30, yPos, { align: "right" });
      doc.text(formatCurrency(quotation.totalAmount, quotation.currency), totalsX, yPos, { align: "right" });
      yPos += 8;
    }


    // Calculate required space for payment terms AND signatures as one unit
    let requiredCombinedHeight = 0;

    // Payment Terms height
    if (quotation.enablePaymentTerms && quotation.paymentTermsDescription) {
      requiredCombinedHeight += 6; // "Payment Terms:" header
      requiredCombinedHeight += wrapText(quotation.paymentTermsDescription, contentWidth).length * 4; // Description lines
      requiredCombinedHeight += 5; // Bottom spacing
    }

    // Add note height
    requiredCombinedHeight += 8; // Note text height (reduced spacing)

    // Prepared by section height
    requiredCombinedHeight += 8; // "Prepared by:" title
    requiredCombinedHeight += 8; // Prepared by name
    requiredCombinedHeight += 8; // Prepared by designation

    // Signature section height (if enabled)
    if (quotation.enableSignatures) {
      requiredCombinedHeight += 10; // "SIGNATURE" header
      requiredCombinedHeight += 15; // "Confirmation Order Acknowledge by:" text
      requiredCombinedHeight += 5; // Signature line
      requiredCombinedHeight += 5; // Space after signature line
      requiredCombinedHeight += 12; // Name field
      requiredCombinedHeight += 12; // Designation field
      requiredCombinedHeight += 12; // Date field
    }

    // Check if we need a new page for the combined payment terms + signatures section
    // Only break to new page if we really don't have enough space (leave room for footer)
    if (yPos + requiredCombinedHeight > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }

    if (quotation.enablePaymentTerms && quotation.paymentTermsDescription) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Terms:", margin, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      wrapText(quotation.paymentTermsDescription, contentWidth).forEach(
        (line) => {
          doc.text(line, margin, yPos);
          yPos += 5;
        }
      );
      yPos += 5;
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for considering our services. We look forward to your acceptance.",
      margin,
      yPos
    );
    yPos += 20; // Reduced spacing to connect with signatures

    // ===== PREPARED BY SECTION =====
    // Prepared by section (left side)
    const preparedByY = yPos;
    const preparedByX = margin;

    // Prepared by title
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Prepared by:", preparedByX, preparedByY);

    // Prepared by name
    if (quotation.preparedByName) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(quotation.preparedByName.toUpperCase(), preparedByX, preparedByY + 8);
    }

    // Prepared by designation
    if (quotation.preparedByDesignation) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(quotation.preparedByDesignation, preparedByX, preparedByY + 14);
    }

    // ===== SIGNATURE SECTION =====
    if (quotation.enableSignatures) {
      // No separate page break check - already handled in combined section above

      // Signature section title (right side)
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      const signatureTitleX = pageWidth - margin - 80; // Position on right side

      // Client signature (right-aligned)
      const signatureY = yPos;
      const signatureX = signatureTitleX;
      const signatureWidth = 80; // Reasonable signature line length

      // Client signature acknowledgment text (right-aligned)
      yPos = signatureY;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text("Confirmation Order Acknowledge by:", signatureX, yPos);
      yPos += 25;

      // Client signature line (left-aligned)
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(signatureX, yPos, signatureX + signatureWidth, yPos);
      yPos += 5;

      // Signature fields with labels
      yPos += 5; // Space after signature line

      // Name field
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text("Name:", signatureX, yPos);
      yPos += 5; // Space for name input

      // Designation field
      doc.text("Designation:", signatureX, yPos);
      yPos += 5; // Space for designation input

      // Date field
      doc.text("Date:", signatureX, yPos);
      yPos += 5; // Space for date input

      yPos = Math.max(preparedByY + 24, signatureY + 60); // Move past both sections
    }

    // ===== FOOTER =====
    addFooterToAllPages(doc, {
      customText: quotation.customFooterText,
      margin,
      pageWidth,
      pageHeight,
    });

    return doc.output("blob");
  };
  /**
   * Downloads the generated PDF
   * @param quotation - The quotation data
   * @param filename - Optional filename for the download
   */
  const downloadPDF = async (quotation: Quotation, filename?: string) => {
    try {
      const blob = await generatePDF(quotation);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        filename || `document-${quotation.quotationNumber || "001"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      throw new Error("Failed to generate PDF");
    }
  };


  return {
    generatePDF,
    downloadPDF,
  };
};
