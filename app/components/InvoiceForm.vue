<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column - Business & Client Info -->
    <div class="lg:col-span-1 space-y-6">
      <!-- Business Information -->
      <BusinessInformation
        :business-name="invoice.businessName"
        :business-email="invoice.businessEmail"
        :business-phone="invoice.businessPhone"
        :business-address-line1="invoice.businessAddressLine1"
        :business-address-line2="invoice.businessAddressLine2"
        :business-address-line3="invoice.businessAddressLine3"
        :business-address-line4="invoice.businessAddressLine4"
        :business-license="invoice.businessLicense"
        :website="invoice.website"
        @update:business-name="invoice.businessName = $event"
        @update:business-email="invoice.businessEmail = $event"
        @update:business-phone="invoice.businessPhone = $event"
        @update:business-address-line1="invoice.businessAddressLine1 = $event"
        @update:business-address-line2="invoice.businessAddressLine2 = $event"
        @update:business-address-line3="invoice.businessAddressLine3 = $event"
        @update:business-address-line4="invoice.businessAddressLine4 = $event"
        @update:business-license="invoice.businessLicense = $event"
        @update:website="invoice.website = $event"
      />

      <!-- Client Information -->
      <ClientInformation
        :client-name="invoice.clientName"
        :client-company-name="invoice.clientCompanyName"
        :client-email="invoice.clientEmail"
        :client-phone="invoice.clientPhone"
        :client-address-line1="invoice.clientAddressLine1"
        :client-address-line2="invoice.clientAddressLine2"
        :client-address-line3="invoice.clientAddressLine3"
        :client-address-line4="invoice.clientAddressLine4"
        @update:client-name="invoice.clientName = $event"
        @update:client-company-name="invoice.clientCompanyName = $event"
        @update:client-email="invoice.clientEmail = $event"
        @update:client-phone="invoice.clientPhone = $event"
        @update:client-address-line1="invoice.clientAddressLine1 = $event"
        @update:client-address-line2="invoice.clientAddressLine2 = $event"
        @update:client-address-line3="invoice.clientAddressLine3 = $event"
        @update:client-address-line4="invoice.clientAddressLine4 = $event"
      />

      <!-- Invoice Details -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Invoice Details</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Invoice Number" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('invoiceNumber')"
            >
              Unique invoice identifier (click to edit)
            </p>
            <UInput
              id="invoiceNumber"
              v-model="invoice.invoiceNumber"
              placeholder="INV-001"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Invoice Date" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('invoiceDate')"
            >
              Invoice date (click to edit)
            </p>
            <UInput
              id="invoiceDate"
              v-model="invoice.date"
              type="date"
              :value="invoice.date || ''"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Due Date" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('dueDate')"
            >
              Payment due date (click to edit)
            </p>
            <UInput
              id="dueDate"
              v-model="invoice.dueDate"
              type="date"
              :value="invoice.dueDate || ''"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Currency" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('currency')"
            >
              Available: {{ currencyOptions.length }} options ({{
                invoice.currency || "None selected"
              }}) - click to change
            </p>
            <USelect
              id="currency"
              v-model="invoice.currency"
              :items="currencyOptions"
              placeholder="Select Currency"
              class="w-full"
              color="primary"
              variant="outline"
              size="md"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Bank Account Information -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Bank Account Information</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Bank Name" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('bankName')"
            >
              Your bank name (click to edit)
            </p>
            <UInput
              id="bankName"
              v-model="invoice.bankDetails.bankName"
              placeholder="e.g., Maybank, CIMB Bank"
              class="placeholder: text-white"
            />
          </UFormGroup>

          <UFormGroup label="Account Number" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('accountNumber')"
            >
              Your bank account number (click to edit)
            </p>
            <UInput
              id="accountNumber"
              v-model="invoice.bankDetails.accountNumber"
              placeholder="e.g., 0000000000"
              class="placeholder: text-white"
            />
          </UFormGroup>

          <UFormGroup label="Account Name" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('accountName')"
            >
              Account holder name (click to edit)
            </p>
            <UInput
              id="accountName"
              v-model="invoice.bankDetails.accountName"
              placeholder="e.g., Your Company Name"
              class="placeholder: text-white"
            />
          </UFormGroup>

          <UFormGroup label="SWIFT Code (Optional)" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('swiftCode')"
            >
              Bank SWIFT code for international transfers (click to edit)
            </p>
            <UInput
              id="swiftCode"
              v-model="invoice.bankDetails.swiftCode"
              placeholder="e.g., EXAMPLEXXX"
              class="placeholder: text-white"
            />
          </UFormGroup>

          <UFormGroup label="Payment Reference" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('paymentReference')"
            >
              Reference number for payment (defaults to invoice number)
            </p>
            <UInput
              id="paymentReference"
              v-model="invoice.paymentReference"
              placeholder="e.g., INV-001"
              class="placeholder: text-white"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Logo Upload Section -->
      <LogoUpload v-model="invoice.logo" />
    </div>

    <!-- Right Column - Items & Payment -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Invoice Items -->
      <ItemsTable
        v-model="invoice.items"
        :show-quantity="false"
        :show-unit-price="false"
      />

      <!-- Subtotal -->
      <div class="flex justify-end">
        <div class="text-right">
          <p class="text-gray-200">
            Subtotal:
            <span class="font-semibold text-white">{{
              formatCurrency(subtotal, invoice.currency)
            }}</span>
          </p>
        </div>
      </div>

      <!-- Tax and Discount -->
      <TaxDiscountSection
        :subtotal="subtotal"
        :tax-rate="invoice.taxRate"
        :discount-rate="invoice.discountRate"
        :currency="invoice.currency"
        @update:tax-rate="invoice.taxRate = $event"
        @update:discount-rate="invoice.discountRate = $event"
      />

      <!-- Payment Terms -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Payment Terms</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Payment Terms" class="text-white">
            <UTextarea
              v-model="invoice.paymentTerms"
              placeholder="Enter payment terms (e.g., Net 30 days, Due on receipt, etc.)"
              :rows="3"
              class="placeholder: text-white w-full"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- PDF Preview -->
      <PdfPreview
        ref="pdfPreviewRef"
        document-type="invoice"
        :document-data="invoice"
        :generate-pdf-function="generatePdfBlob"
        :auto-refresh="true"
        @download="handlePdfDownload"
      />

      <!-- Actions -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Actions</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex gap-3">
            <UButton
              color="primary"
              size="lg"
              class="flex-1"
              @click="openPreview"
            >
              <UIcon name="i-lucide-eye" class="w-5 h-5 mr-2" />
              Preview Invoice
            </UButton>
          </div>

          <div class="flex gap-3">
            <UButton color="success" size="lg" class="flex-1" @click="generatePDF">
              <UIcon name="i-lucide-file-down" class="w-5 h-5 mr-2" />
              Generate Invoice PDF
            </UButton>
          </div>

          <div class="flex gap-3">
            <UButton variant="outline" class="flex-1" @click="saveTemplate">
              <UIcon name="i-lucide-save" class="w-4 h-4 mr-2" />
              Save Template
            </UButton>

            <UButton variant="outline" class="flex-1" @click="loadTemplate">
              <UIcon name="i-lucide-folder-open" class="w-4 h-4 mr-2" />
              Load Template
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Footer -->
    <DocumentFooter
      :business-email="invoice.businessEmail"
      :business-phone="invoice.businessPhone"
      :custom-text="invoice.customFooterText"
      @update:business-email="invoice.businessEmail = $event"
      @update:business-phone="invoice.businessPhone = $event"
      @update:custom-text="invoice.customFooterText = $event"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { formatCurrency } from '~/composables/useDateUtils';
import LogoUpload from '~/components/LogoUpload.vue';
import BusinessInformation from '~/components/BusinessInformation.vue';
import ClientInformation from '~/components/ClientInformation.vue';
import PdfPreview from '~/components/PdfPreview.vue';

// Import composables
const { downloadPDF } = useInvoicePdf();
const toast = useToast();

// Template refs
const pdfPreviewRef = ref();

// Types for invoice data
interface InvoiceItem {
  description: string;
  total: number;
}

interface Invoice {
  businessName: string;
  businessAddressLine1: string;
  businessAddressLine2: string;
  businessAddressLine3: string;
  businessAddressLine4: string;
  businessEmail: string;
  businessPhone: string;
  businessLicense: string;
  website: string;
  clientCompanyName: string;
  clientName: string;
  clientAddressLine1: string;
  clientAddressLine2: string;
  clientAddressLine3: string;
  clientAddressLine4: string;
  clientEmail: string;
  clientPhone: string;
  invoiceNumber: string;
  date: string | undefined;
  dueDate: string | undefined;
  currency: string;
  logo: string | null;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: string;
  taxAmount: number;
  discountRate: string;
  discountAmount: number;
  totalAmount: number;
  paymentTerms: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftCode: string;
  };
  paymentReference: string;
  customFooterText: string;
}

// Reactive invoice data
const invoice = ref<Invoice>({
  businessName: "Your Company Sdn Bhd",
  businessAddressLine1: "Level 1, 123 Example Street",
  businessAddressLine2: "Example District",
  businessAddressLine3: "50000 Kuala Lumpur, Malaysia",
  businessAddressLine4: "",
  businessEmail: "billing@example.com",
  businessPhone: "+60 3-0000 0000",
  businessLicense: "000000000000",
  website: "https://example.com",
  clientCompanyName: "Client Company Ltd",
  clientName: "John Doe",
  clientAddressLine1: "123 Client Street",
  clientAddressLine2: "Client City",
  clientAddressLine3: "12345 Client State",
  clientAddressLine4: "Client Country",
  clientEmail: "client@email.com",
  clientPhone: "+60123456789",
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "MYR",
  logo: null,
  items: [
    { description: "Web Development Services", total: 5000.00 }
  ],
  subtotal: 5000,
  taxRate: "6",
  taxAmount: 300,
  discountRate: "0",
  discountAmount: 0,
  totalAmount: 5300,
  paymentTerms: "Payment is due within 30 days of invoice date. Late payments may incur additional charges.",
  bankDetails: {
    bankName: "Example Bank",
    accountNumber: "0000000000",
    accountName: "Your Company Sdn Bhd",
    swiftCode: "EXAMPLEXXX"
  },
  paymentReference: "INV-001",
  customFooterText: "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000."
});

// Watch for changes to customFooterText
watch(() => invoice.value.customFooterText, () => {
  // Custom footer text changed
});

// Currency options
const currencyOptions = [
  { label: "USD ($)", value: "USD" },
  { label: "MYR (RM)", value: "MYR" },
];


// Computed properties
const subtotal = computed(() => {
  return invoice.value.items.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0);
});

const discountAmount = computed(() => {
  const rate = parseFloat(invoice.value.discountRate) || 0;
  return (subtotal.value * rate) / 100;
});

const taxAmount = computed(() => {
  const rate = parseFloat(invoice.value.taxRate) || 0;
  const taxableAmount = subtotal.value - discountAmount.value;
  return (taxableAmount * rate) / 100;
});

const totalAmount = computed(() => {
  return subtotal.value - discountAmount.value + taxAmount.value;
});

// Watch for changes and update totals
watch([subtotal, discountAmount, taxAmount], () => {
  invoice.value.subtotal = subtotal.value;
  invoice.value.discountAmount = discountAmount.value;
  invoice.value.taxAmount = taxAmount.value;
  invoice.value.totalAmount = totalAmount.value;
}, { immediate: true });

// Watch for invoice number changes to update payment reference
watch(
  () => invoice.value.invoiceNumber,
  (newInvoiceNumber) => {
    if (newInvoiceNumber) {
      invoice.value.paymentReference = newInvoiceNumber;
    }
  }
);


// Methods

const saveToLocalStorage = () => {
  try {
    localStorage.setItem("invoiceTemplate", JSON.stringify(invoice.value));
  } catch (err) {
    console.warn("Failed to save invoice template to localStorage:", err);
  }
};

const generatePDF = async () => {
  try {
    // Save to localStorage before generating PDF
    saveToLocalStorage();

    await downloadPDF(invoice.value);
    toast.add({
      title: "Invoice PDF Generated Successfully!",
      description: "Your invoice has been generated and downloaded.",
      icon: "i-lucide-file-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "PDF Generation Failed",
      description: "There was an error generating your invoice PDF. Please try again.",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  }
};

// Methods for PDF Preview
const generatePdfBlob = async (data: Invoice): Promise<Blob> => {
  const { generatePDF: generatePdfBlob } = useInvoicePdf();
  return await generatePdfBlob(data);
};

const handlePdfDownload = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Create consistent filename: Invoice_INV-001_2025-01-09.pdf
  const docNumber = invoice.value.invoiceNumber || "INV-001";
  const date = invoice.value.date ? invoice.value.date.replace(/-/g, '-') : new Date().toISOString().split('T')[0];
  const filename = `Invoice_${docNumber}_${date}.pdf`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({
    title: "PDF Downloaded!",
    description: "Your invoice PDF has been downloaded.",
    icon: "i-lucide-download",
    color: "success",
  });
};

const openPreview = () => {
  // Save to localStorage before opening preview
  saveToLocalStorage();
  pdfPreviewRef.value?.openModal();
};

const saveTemplate = () => {
  const template = JSON.stringify(invoice.value, null, 2);

  // Save to localStorage
  localStorage.setItem("invoiceTemplate", template);

  // Create and download JSON file
  const blob = new Blob([template], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-template-${invoice.value.invoiceNumber || 'template'}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({
    title: "Template Saved!",
    description: "Your invoice template has been saved to localStorage and downloaded as a JSON file.",
    icon: "i-lucide-save",
    color: "success",
  });
};

const loadTemplate = () => {
  // Create file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';

  fileInput.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = e.target?.result as string;
          const loadedTemplate = JSON.parse(template);

          // Validate that this is an invoice template
          if (!loadedTemplate.invoiceNumber && !loadedTemplate.businessName) {
            throw new Error("Invalid template format");
          }

          invoice.value = loadedTemplate;

          // If the loaded template doesn't have customFooterText, use our default
          if (!loadedTemplate.customFooterText) {
            invoice.value.customFooterText = "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";
          }

          // Update localStorage with the loaded template
          localStorage.setItem("invoiceTemplate", template);

          toast.add({
            title: "Template Loaded!",
            description: "Your invoice template has been loaded and saved to localStorage.",
            icon: "i-lucide-folder-open",
            color: "success",
          });
        } catch {
          toast.add({
            title: "Invalid Template File",
            description: "This is not a valid invoice template file. Please select a .json file exported from the invoice form.",
            icon: "i-lucide-alert-circle",
            color: "error",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // Trigger file selection
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
};

const focusInput = (field: string) => {
  const inputElement = document.getElementById(field) as
    | HTMLInputElement
    | HTMLTextAreaElement;
  if (inputElement) {
    inputElement.focus();
  }
};

// Initialize with sample data
onMounted(() => {
  // Load saved template from localStorage if exists
  const savedTemplate = localStorage.getItem("invoiceTemplate");
  if (savedTemplate) {
    try {
      const loadedTemplate = JSON.parse(savedTemplate);
      invoice.value = loadedTemplate;

      // Ensure customFooterText is set to our default if not present
      if (!loadedTemplate.customFooterText) {
        invoice.value.customFooterText = "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";
      }
    } catch {
      // Template loading failed, continue with default values
    }
  }
});

</script>
