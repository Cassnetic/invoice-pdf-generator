<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column - Business & Client Info -->
    <div class="lg:col-span-1 space-y-6">
      <!-- Business Information -->
      <BusinessInformation
        :business-name="quotation.businessName"
        :business-email="quotation.businessEmail"
        :business-phone="quotation.businessPhone"
        :business-address-line1="quotation.businessAddressLine1"
        :business-address-line2="quotation.businessAddressLine2"
        :business-address-line3="quotation.businessAddressLine3"
        :business-address-line4="quotation.businessAddressLine4"
        :business-license="quotation.businessLicense"
        :website="quotation.website"
        @update:business-name="quotation.businessName = $event"
        @update:business-email="quotation.businessEmail = $event"
        @update:business-phone="quotation.businessPhone = $event"
        @update:business-address-line1="quotation.businessAddressLine1 = $event"
        @update:business-address-line2="quotation.businessAddressLine2 = $event"
        @update:business-address-line3="quotation.businessAddressLine3 = $event"
        @update:business-address-line4="quotation.businessAddressLine4 = $event"
        @update:business-license="quotation.businessLicense = $event"
        @update:website="quotation.website = $event"
      />

      <!-- Client Information -->
      <ClientInformation
        :client-name="quotation.clientName"
        :client-company-name="quotation.clientCompanyName"
        :client-email="quotation.clientEmail"
        :client-phone="quotation.clientPhone"
        :client-address-line1="quotation.clientAddressLine1"
        :client-address-line2="quotation.clientAddressLine2"
        :client-address-line3="quotation.clientAddressLine3"
        :client-address-line4="quotation.clientAddressLine4"
        @update:client-name="quotation.clientName = $event"
        @update:client-company-name="quotation.clientCompanyName = $event"
        @update:client-email="quotation.clientEmail = $event"
        @update:client-phone="quotation.clientPhone = $event"
        @update:client-address-line1="quotation.clientAddressLine1 = $event"
        @update:client-address-line2="quotation.clientAddressLine2 = $event"
        @update:client-address-line3="quotation.clientAddressLine3 = $event"
        @update:client-address-line4="quotation.clientAddressLine4 = $event"
      />

      <!-- Quotation Details -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Quotation Number</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup
            label="Quotation Number"
            class="text-white flex flex-col gap-2"
          >
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('quotationNumber')"
            >
              Unique quotation identifier (click to edit)
            </p>
            <UInput
              id="quotationNumber"
              v-model="quotation.quotationNumber"
              placeholder="QT-001"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Date" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('quotationDate')"
            >
              Quotation date (click to edit)
            </p>
            <UInput
              id="quotationDate"
              v-model="quotation.date"
              type="date"
              :value="quotation.date || ''"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Currency" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('currency')"
            >
              Available: {{ currencyOptions.length }} options ({{
                quotation.currency || "None selected"
              }}) - click to change
            </p>
            <USelect
              id="currency"
              v-model="quotation.currency"
              :items="currencyOptions"
              placeholder="Select Currency"
              class="w-full"
              color="primary"
              variant="outline"
              size="md"
            />
          </UFormGroup>

          <UFormGroup
            label="Validity (Days)"
            class="text-white flex flex-col gap-2"
          >
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('validityDays')"
            >
              Number of days this quotation is valid for payment (click to edit)
            </p>
            <UInput
              id="validityDays"
              v-model="quotation.validityDays"
              type="number"
              min="1"
              placeholder="30"
              class="text-white"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Logo Upload Section -->
      <LogoUpload v-model="quotation.logo" />
      <!-- Footer -->
      <DocumentFooter
        :business-email="quotation.businessEmail"
        :business-phone="quotation.businessPhone"
        :custom-text="quotation.customFooterText"
        @update:business-email="quotation.businessEmail = $event"
        @update:business-phone="quotation.businessPhone = $event"
        @update:custom-text="quotation.customFooterText = $event"
      />
    </div>

    <!-- Right Column - Items & Payment -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Quotation Items -->
      <ItemsTable
        v-model="quotation.items"
        :show-quantity="false"
        :show-unit-price="false"
      />

      <!-- Subtotal -->
      <div class="flex justify-end">
        <div class="text-right">
          <p class="text-gray-200">
            Subtotal:
            <span class="font-semibold text-white">{{
              formatCurrency(subtotal, quotation.currency)
            }}</span>
          </p>
        </div>
      </div>

      <!-- Tax and Discount -->
      <TaxDiscountSection
        :subtotal="subtotal"
        :tax-rate="quotation.taxRate"
        :discount-rate="quotation.discountRate"
        :currency="quotation.currency"
        @update:tax-rate="quotation.taxRate = $event"
        @update:discount-rate="quotation.discountRate = $event"
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
          <UFormGroup label="Enable Payment Terms" class="text-white">
            <div class="flex items-center gap-2">
              <UCheckbox v-model="quotation.enablePaymentTerms" />
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="
                  quotation.enablePaymentTerms = !quotation.enablePaymentTerms
                "
              >
                Check to enable payment terms
              </p>
            </div>
          </UFormGroup>

          <div v-if="quotation.enablePaymentTerms" class="space-y-4">
            <UFormGroup
              label="Deposit Percentage"
              class="text-white flex flex-col gap-2"
            >
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="focusInput('depositPercentage')"
              >
                Percentage of total amount required as deposit (click to edit)
              </p>
              <UInput
                id="depositPercentage"
                v-model="quotation.depositPercentage"
                type="number"
                min="0"
                max="100"
                step="5"
                class="placeholder: text-white"
              />
            </UFormGroup>

            <UFormGroup
              label="Deposit Amount"
              class="text-white flex flex-col gap-2"
            >
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="focusInput('depositPercentage')"
              >
                Automatically calculated from percentage (click to edit
                percentage)
              </p>
              <div class="p-3 bg-gray-800 rounded-lg">
                <span class="text-lg font-semibold text-green-500">{{
                  formatCurrency(depositAmount, quotation.currency)
                }}</span>
              </div>
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="focusInput('depositPercentage')"
              >
                Automatically calculated from percentage (click to edit
                percentage)
              </p>
            </UFormGroup>

            <UFormGroup
              label="Balance Amount"
              class="text-white flex flex-col gap-2"
            >
              <div class="p-3 bg-gray-800 rounded-lg">
                <span class="text-lg font-semibold text-blue-500">{{
                  formatCurrency(balanceAmount, quotation.currency)
                }}</span>
              </div>
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="focusInput('depositPercentage')"
              >
                Remaining amount after deposit (click to edit percentage)
              </p>
            </UFormGroup>

            <UFormGroup
              label="Payment Terms Description"
              class="text-white flex flex-col gap-2"
            >
              <UTextarea
                id="paymentTermsDescription"
                v-model="quotation.paymentTermsDescription"
                placeholder="Describe your payment terms..."
                :rows="5"
                class="placeholder: text-white w-full"
              />
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="focusInput('paymentTermsDescription')"
              >
                This will appear on the quotation (click to edit)
              </p>
            </UFormGroup>
          </div>

          <div v-else class="text-center py-4">
            <p class="text-gray-400">
              Payment terms are disabled. Check the box above to enable.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Unified Signature Section -->
      <div class="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <UIcon name="i-lucide-user" class="w-5 h-5" />
                Prepared By Information
              </h4>

              <!-- Prepared By Section -->
                <div class="flex flex-col gap-4">
                  <UFormGroup label="Name" class="text-white">
                    <UInput
                      v-model="quotation.preparedByName"
                      placeholder="Enter your name"
                      class="text-white w-full"
                    />
                  </UFormGroup>

                  <UFormGroup label="Designation/Position" class="text-white">
                    <UInput
                      v-model="quotation.preparedByDesignation"
                      placeholder="e.g., Sales Manager, Project Coordinator"
                      class="text-white w-full"
                    />
                  </UFormGroup>
                </div>
            </div>

      <!-- Signature Section -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-pen-tool" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Signatures</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Enable Signatures" class="text-white">
            <div class="flex items-center gap-2">
              <UCheckbox v-model="quotation.enableSignatures" />
              <p
                class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                @click="
                  quotation.enableSignatures = !quotation.enableSignatures
                "
              >
                Add signature lines to the quotation
              </p>
            </div>
          </UFormGroup>

          <div v-if="quotation.enableSignatures" class="mt-6 space-y-6">

            <div
              class="p-3 bg-blue-900/20 rounded-lg border border-blue-700/50"
            >
              <div class="flex items-start gap-3">
                <UIcon
                  name="i-lucide-info"
                  class="w-5 h-5 text-blue-400 mt-0.5"
                />
                <div>
                  <p class="text-sm text-blue-200 font-medium"
                    >Signature Information</p
                  >
                  <p class="text-xs text-blue-300 mt-1">
                    Client signature name is auto-filled from client company
                    information. Job title is optional. The signature will
                    appear as a professional signature line on the PDF. The
                    actual signature will need to be added manually after
                    printing or digitally signed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4">
            <p class="text-gray-400">
              Signatures are disabled. Check the box above to enable signature
              lines.
            </p>
          </div>
        </div>
      </UCard>

      <!-- PDF Preview -->
      <PdfPreview
        ref="pdfPreviewRef"
        document-type="quotation"
        :document-data="quotation"
        :generate-pdf-function="generatePdfBlob"
        :auto-refresh="true"
        @download="handlePdfDownload"
      />

      <!-- Total & Actions -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calculator" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Total & Actions</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="text-right">
            <p class="text-2xl font-bold">
              Total: {{ formatCurrency(totalAmount, quotation.currency) }}
            </p>
          </div>

          <!-- Payment Terms Breakdown (only when enabled) -->
          <div
            v-if="quotation.enablePaymentTerms"
            class="space-y-3 p-4 bg-gray-800 rounded-lg"
          >
            <h4 class="font-medium text-gray-300 mb-3">Payment Breakdown</h4>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Subtotal:</span>
                <span class="font-medium">{{
                  formatCurrency(subtotal, quotation.currency)
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-green-400"
                  >Deposit ({{ quotation.depositPercentage }}%):</span
                >
                <span class="font-medium text-green-400">{{
                  formatCurrency(depositAmount, quotation.currency)
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-blue-400">Balance:</span>
                <span class="font-medium text-blue-400">{{
                  formatCurrency(balanceAmount, quotation.currency)
                }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <UButton
              color="primary"
              size="lg"
              class="flex-1"
              @click="openPreview"
            >
              <UIcon name="i-lucide-eye" class="w-5 h-5 mr-2" />
              Preview Quotation
            </UButton>
          </div>

          <div class="flex gap-3">
            <UButton
              color="success"
              size="lg"
              class="flex-1"
              @click="generatePDF"
            >
              <UIcon name="i-lucide-file-down" class="w-5 h-5 mr-2" />
              Generate PDF
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { formatCurrency } from "~/composables/useDateUtils";
import LogoUpload from "~/components/LogoUpload.vue";
import BusinessInformation from "~/components/BusinessInformation.vue";
import ClientInformation from "~/components/ClientInformation.vue";
import PdfPreview from "~/components/PdfPreview.vue";

// Import composables
const { downloadPDF } = useQuotationPdf();
const toast = useToast();

// Template refs
const pdfPreviewRef = ref();

// Types for quotation data
interface QuotationItem {
  description: string;
  total: number;
}

interface Quotation {
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
  quotationNumber: string;
  date: string | undefined;
  currency: string;
  validityDays: string;
  logo: string | null;
  items: QuotationItem[];
  subtotal: number;
  taxRate: string;
  taxAmount: number;
  discountRate: string;
  discountAmount: number;
  totalAmount: number;
  enablePaymentTerms: boolean;
  depositPercentage: string;
  paymentTermsDescription: string;
  customFooterText: string;
  // Prepared by fields
  preparedByName?: string;
  preparedByDesignation?: string;
  // Signature fields
  enableSignatures: boolean;
}

// Reactive quotation data
const quotation = ref<Quotation>({
  businessName: "Your Company Sdn Bhd",
  businessAddressLine1: "Level 1, 123 Example Street",
  businessAddressLine2: "Example District",
  businessAddressLine3: "50000 Kuala Lumpur, Malaysia",
  businessAddressLine4: "",
  businessEmail: "billing@example.com",
  businessPhone: "+60 3-0000 0000",
  businessLicense: "000000000000",
  website: "https://example.com",
  clientName: "Client Name",
  clientCompanyName: "Client Company Name",
  clientAddressLine1: "",
  clientAddressLine2: "",
  clientAddressLine3: "",
  clientAddressLine4: "",
  clientEmail: "client@email.com",
  clientPhone: "+60 3-0000 0000",
  quotationNumber: "QT-001",
  date: new Date().toISOString().split("T")[0],
  currency: "MYR",
  validityDays: "30",
  logo: null,
  items: [
    { description: "Test", total: 100.0 }, // Added initial item for demonstration
  ],
  subtotal: 100,
  taxRate: "6",
  taxAmount: 6,
  discountRate: "0",
  discountAmount: 0,
  totalAmount: 106,
  enablePaymentTerms: true, // Enabled by default to show functionality
  depositPercentage: "50",
  paymentTermsDescription: "", // Initially empty, will be populated by the watcher
  customFooterText:
    "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.",
  // Prepared by fields
  preparedByName: "Alex Tan",
  preparedByDesignation: "",
  // Signature fields
  enableSignatures: true, // Enabled by default
});

// Watch for changes to customFooterText
watch(
  () => quotation.value.customFooterText,
  () => {
    // Custom footer text changed
  }
);

// Auto-populate client signature name from client info

// Currency options
const currencyOptions = [
  { label: "USD ($)", value: "USD" },
  { label: "MYR (RM)", value: "MYR" },
];

// Computed properties
const subtotal = computed(() => {
  return quotation.value.items.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0);
});

const discountAmount = computed(() => {
  const rate = parseFloat(quotation.value.discountRate) || 0;
  return (subtotal.value * rate) / 100;
});

const taxAmount = computed(() => {
  const rate = parseFloat(quotation.value.taxRate) || 0;
  const taxableAmount = subtotal.value - discountAmount.value;
  return (taxableAmount * rate) / 100;
});

const totalAmount = computed(() => {
  return subtotal.value - discountAmount.value + taxAmount.value;
});

const depositAmount = computed(() => {
  if (!quotation.value.enablePaymentTerms) return 0;
  return (
    (totalAmount.value * parseFloat(quotation.value.depositPercentage || "0")) /
    100
  );
});

const balanceAmount = computed(() => {
  if (!quotation.value.enablePaymentTerms) return 0;
  return totalAmount.value - depositAmount.value;
});

// Watch for changes and update the payment terms description automatically
watch(
  [
    () => quotation.value.depositPercentage,
    totalAmount,
    () => quotation.value.currency,
    () => quotation.value.enablePaymentTerms,
  ],
  () => {
    if (quotation.value.enablePaymentTerms) {
      const depositPerc = quotation.value.depositPercentage || "0";
      const depositStr = formatCurrency(
        depositAmount.value,
        quotation.value.currency
      );
      const balanceStr = formatCurrency(
        balanceAmount.value,
        quotation.value.currency
      );
      const remainingPerc = 100 - parseFloat(depositPerc);

      quotation.value.paymentTermsDescription = `A DEPOSIT OF ${depositPerc}% (${depositStr}) IS REQUIRED UPON ACCEPTANCE OF THIS QUOTATION. AN INVOICE WILL BE ISSUED FOR THE DEPOSIT AMOUNT. THE REMAINING ${remainingPerc}% BALANCE PAYMENT (${balanceStr}) IS DUE UPON COMPLETION AND SUCCESSFUL DELIVERY. A FINAL INVOICE WILL BE ISSUED FOR THE BALANCE AMOUNT. ALL PAYMENT CONFIRMATIONS WILL BE ACCOMPANIED BY AN OFFICIAL RECEIPT.`;
    }
  },
  { immediate: true } // This runs the watcher once on component load
);

// Watch for changes and update totals
watch(
  [subtotal, discountAmount, taxAmount],
  () => {
    quotation.value.subtotal = subtotal.value;
    quotation.value.discountAmount = discountAmount.value;
    quotation.value.taxAmount = taxAmount.value;
    quotation.value.totalAmount = totalAmount.value;
  },
  { immediate: true }
);

// Methods

const saveToLocalStorage = () => {
  try {
    localStorage.setItem("quotationTemplate", JSON.stringify(quotation.value));
  } catch (err) {
    console.warn("Failed to save quotation template to localStorage:", err);
  }
};

const generatePDF = async () => {
  try {
    // Save to localStorage before generating PDF
    saveToLocalStorage();

    await downloadPDF(quotation.value);
    toast.add({
      title: "PDF Generated Successfully!",
      description: "Your quotation has been generated and downloaded.",
      icon: "i-lucide-file-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "PDF Generation Failed",
      description: "There was an error generating your PDF. Please try again.",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  }
};

// Methods for PDF Preview
const generatePdfBlob = async (data: Quotation): Promise<Blob> => {
  const { generatePDF: generatePdfBlob } = useQuotationPdf();
  return await generatePdfBlob(data);
};

const handlePdfDownload = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Create consistent filename: Quotation_QT-001_2025-01-09.pdf
  const docNumber = quotation.value.quotationNumber || "QT-001";
  const date = quotation.value.date ? quotation.value.date.replace(/-/g, '-') : new Date().toISOString().split('T')[0];
  const filename = `Quotation_${docNumber}_${date}.pdf`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({
    title: "PDF Downloaded!",
    description: "Your quotation PDF has been downloaded.",
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
  const template = JSON.stringify(quotation.value, null, 2);

  // Save to localStorage
  localStorage.setItem("quotationTemplate", template);

  // Create and download JSON file
  const blob = new Blob([template], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quotation-template-${
    quotation.value.quotationNumber || "template"
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({
    title: "Template Saved!",
    description:
      "Your quotation template has been saved to localStorage and downloaded as a JSON file.",
    icon: "i-lucide-save",
    color: "success",
  });
};

const loadTemplate = () => {
  // Create file input element
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.style.display = "none";

  fileInput.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = e.target?.result as string;
          const loadedTemplate = JSON.parse(template);

          // Validate that this is a quotation template
          if (!loadedTemplate.quotationNumber && !loadedTemplate.businessName) {
            throw new Error("Invalid template format");
          }

          // Preserve the current customFooterText if the loaded template doesn't have it or has an old version
          quotation.value = loadedTemplate;

          // If the loaded template doesn't have customFooterText, use our default
          if (!loadedTemplate.customFooterText) {
            quotation.value.customFooterText =
              "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";
          }


          // Update localStorage with the loaded template
          localStorage.setItem("quotationTemplate", template);

          toast.add({
            title: "Template Loaded!",
            description:
              "Your quotation template has been loaded and saved to localStorage.",
            icon: "i-lucide-folder-open",
            color: "success",
          });
        } catch {
          toast.add({
            title: "Invalid Template File",
            description:
              "This is not a valid quotation template file. Please select a .json file exported from the quotation form.",
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
  const savedTemplate = localStorage.getItem("quotationTemplate");
  if (savedTemplate) {
    try {
      const loadedTemplate = JSON.parse(savedTemplate);
      quotation.value = loadedTemplate;

      // Ensure customFooterText is set to our default if not present
      if (!loadedTemplate.customFooterText) {
        quotation.value.customFooterText =
          "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";
      }

    } catch {
      // Template loading failed, continue with default values
    }
  }
});
</script>
