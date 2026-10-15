/**
 * Composable for generating and downloading professional receipts
 * Uses jsPDF for client-side PDF generation
 * Follows industry best practices for receipt formatting
 */

import { formatCurrency } from "./useDateUtils";
import { addFooterToAllPages } from "./useFooter";

// Define proper types for receipt data
interface ReceiptItem {
  description: string;
  total: number;
}

interface Receipt {
  businessName: string;
  businessAddressLine1?: string;
  businessAddressLine2?: string;
  businessAddressLine3?: string;
  businessAddressLine4?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessLicense?: string;
  website?: string;
  businessTaxId?: string;
  clientName?: string;
  clientCompanyName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddressLine1?: string;
  clientAddressLine2?: string;
  clientAddressLine3?: string;
  clientAddressLine4?: string;
  receiptNumber: string;
  date?: string;
  time?: string;
  currency: string;
  logo?: string | null;
  items: ReceiptItem[];
  subtotal: number;
  taxRate?: string;
  taxAmount?: number;
  discountRate?: string;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentReference?: string;
  cashReceived?: number;
  change?: number;
  notes?: string;
  thankYouMessage?: string;
  customFooterText?: string;
}

export const useReceiptPdf = () => {
  /**
   * Generates a professional PDF receipt from the provided receipt data
   * @param receipt - The receipt data to generate PDF from
   * @returns Promise<Blob> - The generated PDF as a blob
   */
  const generatePDF = async (receipt: Receipt): Promise<Blob> => {
    // Dynamic import of jsPDF to avoid SSR issues
    const { default: jsPDF } = await import("jspdf");

    // Create new PDF document
    const doc = new jsPDF();

    // Document settings
    const pageWidth = doc.internal.pageSize.width || 210; // A4 width in mm
    const pageHeight = doc.internal.pageSize.height || 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper to check for new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - 20) {
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
    // Business Logo (if available)
    if (receipt.logo) {
      try {
        // Create a promise to handle image loading
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              const logoWidth = 30;
              const logoHeight = 30;
              doc.addImage(img, 'PNG', pageWidth / 2 - logoWidth / 2, yPos, logoWidth, logoHeight);
              yPos += logoHeight + 10;
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => {
            reject(new Error('Failed to load logo image'));
          };
          img.src = receipt.logo || '';
        });
      } catch (error) {
        console.warn('Could not load logo:', error);
        // Continue without logo if loading fails
      }
    }

    // Receipt Header (Stripe style)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Receipt from ${receipt.businessName || "Business Name"}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    // Receipt Number (Stripe style)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt #${receipt.receiptNumber}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 8;

    // Business Address (Centered)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    const addressLines = [
      receipt.businessAddressLine1,
      receipt.businessAddressLine2,
      receipt.businessAddressLine3,
      receipt.businessAddressLine4,
    ].filter(Boolean);

    addressLines.forEach((line) => {
      doc.text(line || '', pageWidth / 2, yPos, { align: "center" });
      yPos += 4;
    });

    if (receipt.businessEmail) {
      doc.text(`Email: ${receipt.businessEmail}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 4;
    }
    if (receipt.businessPhone) {
      doc.text(`Phone: ${receipt.businessPhone}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 4;
    }
    if (receipt.businessLicense) {
      doc.text(`Business No: ${receipt.businessLicense}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 4;
    }
    if (receipt.website) {
      doc.text(`Website: ${receipt.website}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 4;
    }

    // Business Logo (right side, centered with business info) - REMOVED to prevent overlap with payment method

    yPos += 5;

    // Client information (moved to top for better flow)
    if (receipt.clientName || receipt.clientCompanyName || receipt.clientEmail || receipt.clientPhone) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Client:", margin, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      if (receipt.clientName) {
        doc.text(`Name: ${receipt.clientName}`, margin, yPos);
        yPos += 4;
      }
      if (receipt.clientCompanyName) {
        doc.text(`Company: ${receipt.clientCompanyName}`, margin, yPos);
        yPos += 4;
      }
      if (receipt.clientEmail) {
        doc.text(`Email: ${receipt.clientEmail}`, margin, yPos);
        yPos += 4;
      }
      if (receipt.clientPhone) {
        doc.text(`Phone: ${receipt.clientPhone}`, margin, yPos);
        yPos += 4;
      }
      yPos += 8;
    }

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ===== DATE PAID AND PAYMENT METHOD (justify-between) =====
    const transactionY = yPos;

    // DATE PAID (left side)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("DATE PAID", margin, transactionY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const paidDate = receipt.date ? new Date(receipt.date) : new Date();
    doc.text(`${paidDate.toLocaleDateString()}, ${paidDate.toLocaleTimeString()}`, margin, transactionY + 6);

    // PAYMENT METHOD (right side)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("PAYMENT METHOD", pageWidth - margin, transactionY, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const paymentMethodText = receipt.paymentReference ? `${receipt.paymentMethod || ''} - ${receipt.paymentReference}` : (receipt.paymentMethod || '');
    doc.text(paymentMethodText, pageWidth - margin, transactionY + 6, { align: "right" });

    yPos = transactionY + 20;

    // ===== RECEIPT ITEMS TABLE =====
    if (receipt.items && receipt.items.length > 0) {
      // Check if items table needs a new page (estimate space for header + 3 items minimum)
      const itemsSpaceNeeded = 60; // Space for header + a few items
      if (checkNewPage(itemsSpaceNeeded)) {
        // If we moved to a new page, we're good to continue
      }

      const tableHeaderY = yPos;

      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, tableHeaderY, contentWidth, 10, "F");

      doc.setFontSize(10); // Match invoice/quotation font size
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50);

      doc.text("Item", margin + 5, tableHeaderY + 7); // Match invoice/quotation exactly
      doc.text("Description", margin + 25, tableHeaderY + 7);
      doc.text("Total", pageWidth - margin - 2, tableHeaderY + 7, { align: "right" });

      yPos += 12;

      // Table rows
      receipt.items.forEach((item, index) => {
        if (!item) return;

        const LINE_HEIGHT = 5; // Match invoice/quotation line height
        const descriptionWidth = contentWidth - 65; // Match invoice/quotation exactly
        const descriptionLines = wrapText(item.description || "", descriptionWidth);
        const rowHeight = Math.max(15, descriptionLines.length * LINE_HEIGHT + 6); // Match invoice/quotation height

        checkNewPage(rowHeight);
        const rowStartY = yPos;
        const contentY = rowStartY + 8; // Match invoice/quotation padding

        // Item number
        doc.setFontSize(9); // Match invoice/quotation font size
        doc.setFont("helvetica", "normal");
        doc.text(String(index + 1) + ".", margin + 5, contentY); // Match invoice/quotation exactly

        // Description
        let currentDescY = contentY;
        descriptionLines.forEach((line) => {
          doc.text(line, margin + 25, currentDescY); // Match invoice/quotation exactly
          currentDescY += LINE_HEIGHT; // Match invoice/quotation line spacing
        });

        // Total
        const itemTotal = item.total || 0;
        doc.text(formatCurrency(itemTotal, receipt.currency), pageWidth - margin, contentY, { align: "right" }); // Match invoice/quotation exactly

        yPos = rowStartY + rowHeight;

        // Row separator
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, yPos, pageWidth - margin, yPos);
      });

      yPos += 10;

      // ===== TOTALS SECTION (moved above summary) =====
      // Check if totals section needs a new page (keep with items if possible)
      const totalsSpaceNeeded = 30; // Space for totals section
      if (checkNewPage(totalsSpaceNeeded)) {
        // If we moved to a new page, we're good to continue
      }

      const totalsX = pageWidth - margin; // Move to right end of page
      const totalsY = yPos;

      // Only show subtotal if there are discounts or taxes
      const hasDiscount = (receipt.discountAmount || 0) > 0;
      const hasTax = (receipt.taxAmount || 0) > 0;

      if (hasDiscount || hasTax) {
        // Subtotal
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", totalsX - 30, totalsY, { align: "right" });
        doc.text(formatCurrency(receipt.subtotal, receipt.currency), totalsX, totalsY, { align: "right" });
        yPos += 6;
      }

      // Discount (if any)
      if (hasDiscount) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Discount (${receipt.discountRate || 0}%):`, totalsX - 30, yPos, { align: "right" });
        doc.text(`-${formatCurrency(receipt.discountAmount || 0, receipt.currency)}`, totalsX, yPos, { align: "right" });
        yPos += 6;
      }

      // Tax (if any)
      if (hasTax) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Tax (${receipt.taxRate || 0}%):`, totalsX - 30, yPos, { align: "right" });
        doc.text(formatCurrency(receipt.taxAmount || 0, receipt.currency), totalsX, yPos, { align: "right" });
        yPos += 6;
      }

      // Total (always show, consistent with invoice/quotation)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Total: ", totalsX - 30, yPos, { align: "right" });
      doc.text(formatCurrency(receipt.totalAmount, receipt.currency), totalsX, yPos, { align: "right" });
      yPos += 15;

      // ===== SUMMARY SECTION (Stripe style) =====
      // Check if summary section needs a new page (only if really necessary)
      const summarySpaceNeeded = 40; // Space for title + box + spacing
      if (checkNewPage(summarySpaceNeeded)) {
        // If we moved to a new page, we're good to continue
      }

      // Add Summary title
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text("SUMMARY", margin, yPos);
      yPos += 8;

      // Determine if this is a cash payment with partial payment details
      const isCashPayment = receipt.paymentMethod === 'Cash';
      const hasCashDetails = isCashPayment && receipt.cashReceived && receipt.cashReceived > 0;
      const hasChange = hasCashDetails && receipt.change !== undefined && receipt.change !== 0;

      // Summary box (Stripe style) - adjust height based on content
      const summaryBoxY = yPos;
      const summaryBoxHeight = hasCashDetails ? (hasChange ? 28 : 20) : 28;
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, summaryBoxY, pageWidth - margin * 2, summaryBoxHeight, "F");

      if (hasCashDetails) {
        // Cash payment details (match reference image)
        // Cash Payment to business (first line) - show amount received, not total
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(`Cash Payment to ${receipt.businessName}`, margin + 8, summaryBoxY + 8);
        doc.text(formatCurrency(receipt.cashReceived || 0, receipt.currency), pageWidth - margin - 8, summaryBoxY + 8, { align: "right" });

        // Horizontal line inside summary box
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + 8, summaryBoxY + 12, pageWidth - margin - 8, summaryBoxY + 12);

        // Change or amount owed (second line, bold, same font size)
        if (hasChange) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const changeAmount = receipt.change || 0;
          if (changeAmount > 0) {
            doc.setTextColor(0, 150, 0); // Green for change due
            doc.text("Change due", margin + 8, summaryBoxY + 18);
            doc.text(formatCurrency(changeAmount, receipt.currency), pageWidth - margin - 8, summaryBoxY + 18, { align: "right" });
          } else {
            doc.setTextColor(200, 0, 0); // Red for amount owed
            doc.text("Amount owed", margin + 8, summaryBoxY + 18);
            doc.text(formatCurrency(Math.abs(changeAmount), receipt.currency), pageWidth - margin - 8, summaryBoxY + 18, { align: "right" });
          }
        }
      } else {
        // Regular payment (non-cash or full cash payment) - match reference image
        // Payment to business (first line)
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(`Payment to ${receipt.businessName}`, margin + 8, summaryBoxY + 8);
        doc.text(formatCurrency(receipt.totalAmount, receipt.currency), pageWidth - margin - 8, summaryBoxY + 8, { align: "right" });

        // Horizontal line inside summary box
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin + 8, summaryBoxY + 12, pageWidth - margin - 8, summaryBoxY + 12);

        // Amount paid (second line, bold, same font size)
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Amount paid", margin + 8, summaryBoxY + 18);
        doc.text(formatCurrency(receipt.totalAmount, receipt.currency), pageWidth - margin - 8, summaryBoxY + 18, { align: "right" });
      }

      yPos = summaryBoxY + summaryBoxHeight + 10;
    }

    // ===== PAYMENT INFORMATION ===== (REMOVED - unnecessary for simple receipts)

    // ===== NOTES =====
    if (receipt.notes) {
      checkNewPage(20);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", margin, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      wrapText(receipt.notes, contentWidth).forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
      yPos += 5;
    }


    // ===== FOOTER =====
    addFooterToAllPages(doc, {
      customText: receipt.customFooterText,
      margin,
      pageWidth,
      pageHeight,
    });

    return doc.output("blob");
  };

  /**
   * Downloads the generated PDF receipt
   * @param receipt - The receipt data
   * @param filename - Optional filename for the download
   */
  const downloadPDF = async (receipt: Receipt, filename?: string) => {
    try {
      const blob = await generatePDF(receipt);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `document-${receipt.receiptNumber || "001"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating receipt PDF:", error);
      throw new Error("Failed to generate receipt PDF");
    }
  };


  /**
   * Formats time for display
   * @param timeString - Time string
   * @returns Formatted time string
   */
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    return timeString;
  };

  /**
   * Calculates receipt totals
   * @param items - Array of receipt items
   * @param taxRate - Tax rate percentage
   * @param discountRate - Discount rate percentage
   * @returns Object with calculated totals
   */
  const calculateTotals = (items: ReceiptItem[], taxRate: number = 0, discountRate: number = 0) => {
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
    formatTime,
    calculateTotals,
  };
};
