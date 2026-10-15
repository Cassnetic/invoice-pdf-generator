import { formatCurrentDate } from "./useDateUtils";

/**
 * Reusable footer utility for PDF generation
 * Provides consistent footer styling and content across all document types
 */

interface FooterOptions {
  customText?: string;
  pageNumber?: number;
  totalPages?: number;
  margin?: number;
  pageWidth?: number;
  pageHeight?: number;
}

/**
 * Adds a footer to a PDF document
 * @param doc - jsPDF document instance
 * @param options - Footer configuration options
 */
export const addFooter = (
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: FooterOptions = {}
) => {
  const {
    customText,
    pageNumber = 1,
    totalPages = 1,
    margin = 15,
    pageWidth = 210,
    pageHeight = 297,
  } = options;

  const footerY = pageHeight - 15;

  // Contact information at bottom (closer to footer line)
  const contactY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  // Use only the custom text provided
  const contactText = customText || "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";

  // Wrap text to fit page width
  const wrapText = (text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const textWidth = doc.getTextWidth(testLine);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const contactLines = wrapText(contactText, pageWidth - margin * 2 - 10);
  contactLines.forEach((line, index) => {
    doc.text(line, pageWidth / 2, contactY + (index * 3.5), { align: "center" });
  });

  // Footer line and page info
  doc.setLineWidth(0.5);
  doc.setDrawColor(150, 150, 150);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);

  doc.text(`Page ${pageNumber} of ${totalPages}`, margin, footerY + 3);
  doc.text("Thank you for your business!", pageWidth / 2, footerY + 3, { align: "center" });
  doc.text(`Generated: ${formatCurrentDate()}`, pageWidth - margin, footerY + 3, { align: "right" });
};

/**
 * Adds footer to all pages of a PDF document
 * @param doc - jsPDF document instance
 * @param options - Footer configuration options
 */
export const addFooterToAllPages = (
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: FooterOptions = {}
) => {
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, { ...options, pageNumber: i, totalPages });
  }
};
