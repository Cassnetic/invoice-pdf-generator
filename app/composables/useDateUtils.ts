/**
 * Shared date formatting utilities for all PDF documents
 */

/**
 * Formats date for display in PDF documents
 * @param dateString - ISO date string
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formats currency for display in PDF documents
 * @param amount - Amount to format
 * @param currency - Currency code (USD, MYR, etc.)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Formats current date for display in PDF documents
 * @returns Formatted current date string (DD/MM/YYYY)
 */
export const formatCurrentDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
