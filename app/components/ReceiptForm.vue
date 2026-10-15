<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column - Business & Customer Info -->
    <div class="lg:col-span-1 space-y-6">
      <!-- Business Information -->
      <BusinessInformation
        :business-name="receipt.businessName"
        :business-email="receipt.businessEmail"
        :business-phone="receipt.businessPhone"
        :business-address-line1="receipt.businessAddressLine1"
        :business-address-line2="receipt.businessAddressLine2"
        :business-address-line3="receipt.businessAddressLine3"
        :business-address-line4="receipt.businessAddressLine4"
        :business-license="receipt.businessLicense"
        :website="receipt.website"
        @update:business-name="receipt.businessName = $event"
        @update:business-email="receipt.businessEmail = $event"
        @update:business-phone="receipt.businessPhone = $event"
        @update:business-address-line1="receipt.businessAddressLine1 = $event"
        @update:business-address-line2="receipt.businessAddressLine2 = $event"
        @update:business-address-line3="receipt.businessAddressLine3 = $event"
        @update:business-address-line4="receipt.businessAddressLine4 = $event"
        @update:business-license="receipt.businessLicense = $event"
        @update:website="receipt.website = $event"
      />

      <!-- Client Information -->
      <ClientInformation
        :client-name="receipt.clientName"
        :client-company-name="receipt.clientCompanyName"
        :client-email="receipt.clientEmail"
        :client-phone="receipt.clientPhone"
        :client-address-line1="receipt.clientAddressLine1"
        :client-address-line2="receipt.clientAddressLine2"
        :client-address-line3="receipt.clientAddressLine3"
        :client-address-line4="receipt.clientAddressLine4"
        @update:client-name="receipt.clientName = $event"
        @update:client-company-name="receipt.clientCompanyName = $event"
        @update:client-email="receipt.clientEmail = $event"
        @update:client-phone="receipt.clientPhone = $event"
        @update:client-address-line1="receipt.clientAddressLine1 = $event"
        @update:client-address-line2="receipt.clientAddressLine2 = $event"
        @update:client-address-line3="receipt.clientAddressLine3 = $event"
        @update:client-address-line4="receipt.clientAddressLine4 = $event"
      />

      <!-- Receipt Details -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Receipt Details</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Receipt Number" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('receiptNumber')"
            >
              Unique receipt identifier (click to edit)
            </p>
            <UInput
              id="receiptNumber"
              v-model="receipt.receiptNumber"
              placeholder="RCP-001"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Date" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('receiptDate')"
            >
              Receipt date (click to edit)
            </p>
            <UInput
              id="receiptDate"
              v-model="receipt.date"
              type="date"
              :value="receipt.date || ''"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Time" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('receiptTime')"
            >
              Receipt time (click to edit)
            </p>
            <UInput
              id="receiptTime"
              v-model="receipt.time"
              type="time"
              :value="receipt.time || ''"
              class="text-white"
            />
          </UFormGroup>

          <UFormGroup label="Currency" class="text-white flex flex-col gap-2">
            <p
              class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
              @click="focusInput('currency')"
            >
              Available: {{ currencyOptions.length }} options ({{
                receipt.currency || "None selected"
              }}) - click to change
            </p>
            <USelect
              id="currency"
              v-model="receipt.currency"
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

      <!-- Logo Upload Section -->
      <LogoUpload v-model="receipt.logo" />
    </div>

    <!-- Right Column - Items & Payment -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Receipt Items -->
      <ItemsTable
        v-model="receipt.items"
        :show-quantity="false"
        :show-unit-price="false"
      />

      <!-- Subtotal -->
      <div class="flex justify-end">
        <div class="text-right">
          <p class="text-gray-200">
            Subtotal:
            <span class="font-semibold text-white">{{
              formatCurrency(subtotal, receipt.currency)
            }}</span>
          </p>
        </div>
      </div>

      <!-- Tax and Discount -->
      <TaxDiscountSection
        :subtotal="subtotal"
        :tax-rate="receipt.taxRate"
        :discount-rate="receipt.discountRate"
        :currency="receipt.currency"
        @update:tax-rate="receipt.taxRate = $event"
        @update:discount-rate="receipt.discountRate = $event"
      />

      <!-- Payment Information -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
            <h3 class="text-lg font-semibold text-white">Payment Information</h3>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Payment Method Selection -->
          <div class="space-y-2">
            <UFormGroup label="How was this payment made?" class="text-white">
              <p class="text-sm text-gray-400 mb-3">
                Select the payment method used for this transaction
              </p>
              <USelect
                v-model="receipt.paymentMethod"
                :items="paymentMethodOptions"
                placeholder="Choose payment method..."
                class="w-full"
                color="primary"
                variant="outline"
                size="lg"
                :ui="{
                  base: 'text-white'
                }"
              />
            </UFormGroup>
          </div>

          <!-- Payment Reference -->
          <div class="space-y-2">
            <UFormGroup label="Transaction Reference" class="text-white">
              <p class="text-sm text-gray-400 mb-3">
                Enter transaction ID, check number, or other reference
              </p>
              <UInput
                v-model="receipt.paymentReference"
                placeholder="e.g., TXN-123456, Check #789, etc."
                class="w-full"
                size="lg"
                color="primary"
                variant="outline"
              />
            </UFormGroup>
          </div>

          <!-- Cash Payment Details -->
          <div v-if="receipt.paymentMethod === 'Cash'" class="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 class="text-sm font-medium text-gray-300 mb-3">Cash Payment Details</h4>

            <!-- Amount Received - Full Width -->
            <UFormGroup label="Amount Received" class="text-white">
              <p class="text-xs text-gray-400 mb-2">
                Enter the cash amount received from customer
              </p>
              <UInput
                v-model="receipt.cashReceived"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full"
                size="lg"
                color="primary"
                variant="outline"
                @input="calculateChange"
              />
            </UFormGroup>

            <!-- Change Due - Full Width -->
            <UFormGroup label="Change Due" class="text-white">
              <p class="text-xs text-gray-400 mb-2">
                {{ change >= 0 ? 'Amount to return to customer' : 'Amount still owed by customer' }}
              </p>
              <div class="p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-300">
                    {{ change >= 0 ? 'Change:' : 'Still owed:' }}
                  </span>
                  <span
                    class="text-xl font-bold"
                    :class="change >= 0 ? 'text-green-400' : 'text-red-400'"
                  >
                    {{ formatCurrency(Math.abs(change), receipt.currency) }}
                  </span>
                </div>
              </div>
            </UFormGroup>
          </div>

          <!-- Payment Summary -->
          <div class="p-4 bg-primary-900/20 rounded-lg border border-primary-700/50">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-primary-200">Total Amount</h4>
                <p class="text-xs text-primary-300">Amount to be paid</p>
              </div>
              <span class="text-2xl font-bold text-primary-100">{{
                formatCurrency(receipt.totalAmount, receipt.currency)
              }}</span>
            </div>
          </div>
        </div>
      </UCard>


      <!-- PDF Preview -->
      <PdfPreview
        ref="pdfPreviewRef"
        document-type="receipt"
        :document-data="receipt"
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
              Preview Receipt
            </UButton>
          </div>

          <div class="flex gap-3">
            <UButton color="success" size="lg" class="flex-1" @click="generatePDF">
              <UIcon name="i-lucide-file-down" class="w-5 h-5 mr-2" />
              Generate Receipt PDF
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
      :business-email="receipt.businessEmail"
      :business-phone="receipt.businessPhone"
      :custom-text="receipt.customFooterText"
      @update:business-email="receipt.businessEmail = $event"
      @update:business-phone="receipt.businessPhone = $event"
      @update:custom-text="receipt.customFooterText = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { formatCurrency } from '~/composables/useDateUtils';
import TaxDiscountSection from '~/components/TaxDiscountSection.vue';
import LogoUpload from '~/components/LogoUpload.vue';
import BusinessInformation from '~/components/BusinessInformation.vue';
import ClientInformation from '~/components/ClientInformation.vue';
import PdfPreview from '~/components/PdfPreview.vue';

// Import composables
const { downloadPDF } = useReceiptPdf();
const toast = useToast();

// Template refs
const pdfPreviewRef = ref();

// Types for receipt data
interface ReceiptItem {
  description: string;
  total: number;
}

interface Receipt {
  businessName: string;
  businessAddressLine1: string;
  businessAddressLine2: string;
  businessAddressLine3: string;
  businessAddressLine4: string;
  businessEmail: string;
  businessPhone: string;
  businessLicense: string;
  website: string;
  clientName: string;
  clientCompanyName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddressLine1: string;
  clientAddressLine2: string;
  clientAddressLine3: string;
  clientAddressLine4: string;
  receiptNumber: string;
  date: string | undefined;
  time: string | undefined;
  currency: string;
  logo: string | null;
  items: ReceiptItem[];
  subtotal: number;
  taxRate: string;
  taxAmount: number;
  discountRate: string;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  cashReceived: number;
  change: number;
  customFooterText: string;
}

// Reactive receipt data
const receipt = ref<Receipt>({
  businessName: "Your Company Sdn Bhd",
  businessAddressLine1: "Level 1, 123 Example Street",
  businessAddressLine2: "Example District",
  businessAddressLine3: "50000 Kuala Lumpur, Malaysia",
  businessAddressLine4: "",
  businessEmail: "billing@example.com",
  businessPhone: "+60 3-0000 0000",
  businessLicense: "000000000000",
  website: "https://example.com",
  clientName: "John Doe",
  clientCompanyName: "Client Company Ltd",
  clientEmail: "client@email.com",
  clientPhone: "+60123456789",
  clientAddressLine1: "",
  clientAddressLine2: "",
  clientAddressLine3: "",
  clientAddressLine4: "",
  receiptNumber: "RCP-001",
  date: new Date().toISOString().split("T")[0],
  time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
  currency: "MYR",
  logo: null,
  items: [
    { description: "Web Development Services", total: 1000.00 }
  ],
  subtotal: 1000,
  taxRate: "6",
  taxAmount: 60,
  discountRate: "0",
  discountAmount: 0,
  totalAmount: 1060,
  paymentMethod: "Cash",
  paymentReference: "",
  cashReceived: 0,
  change: 0,
  customFooterText: "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000."
});

// Currency options
const currencyOptions = [
  { label: "USD ($)", value: "USD" },
  { label: "MYR (RM)", value: "MYR" },
];

// Payment method options
const paymentMethodOptions = [
  { label: "Cash", value: "Cash" },
  { label: "Credit Card", value: "Credit Card" },
  { label: "Debit Card", value: "Debit Card" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Check", value: "Check" },
  { label: "Digital Wallet", value: "Digital Wallet" },
  { label: "Other", value: "Other" },
];


// Computed properties
const subtotal = computed(() => {
  return receipt.value.items.reduce((sum, item) => {
    return sum + (parseFloat(String(item.total)) || 0);
  }, 0);
});


const change = computed(() => {
  const cashReceived = receipt.value.cashReceived || 0;
  return cashReceived - receipt.value.totalAmount;
});

// Watch for subtotal changes and update all calculations
watch(subtotal, () => {
  receipt.value.subtotal = subtotal.value;

  // Recalculate tax and discount amounts
  const taxRate = parseFloat(receipt.value.taxRate) || 0;
  const discountRate = parseFloat(receipt.value.discountRate) || 0;
  const discountAmount = (subtotal.value * discountRate) / 100;
  const taxableAmount = subtotal.value - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;

  // Update all calculated values
  receipt.value.discountAmount = discountAmount;
  receipt.value.taxAmount = taxAmount;
  receipt.value.totalAmount = subtotal.value - discountAmount + taxAmount;
}, { immediate: true });

// Watch for tax rate changes
watch(() => receipt.value.taxRate, () => {
  const taxRate = parseFloat(receipt.value.taxRate) || 0;
  const discountRate = parseFloat(receipt.value.discountRate) || 0;
  const discountAmount = (subtotal.value * discountRate) / 100;
  const taxableAmount = subtotal.value - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;

  receipt.value.taxAmount = taxAmount;
  receipt.value.totalAmount = subtotal.value - discountAmount + taxAmount;
}, { immediate: true });

// Watch for discount rate changes
watch(() => receipt.value.discountRate, () => {
  const taxRate = parseFloat(receipt.value.taxRate) || 0;
  const discountRate = parseFloat(receipt.value.discountRate) || 0;
  const discountAmount = (subtotal.value * discountRate) / 100;
  const taxableAmount = subtotal.value - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;

  receipt.value.discountAmount = discountAmount;
  receipt.value.taxAmount = taxAmount;
  receipt.value.totalAmount = subtotal.value - discountAmount + taxAmount;
}, { immediate: true });

// Watch for change calculation and update receipt.change
watch(change, () => {
  receipt.value.change = change.value;
}, { immediate: true });

// Methods

const saveToLocalStorage = () => {
  try {
    localStorage.setItem("receiptTemplate", JSON.stringify(receipt.value));
  } catch (err) {
    console.warn("Failed to save receipt template to localStorage:", err);
  }
};

const calculateChange = () => {
  receipt.value.change = change.value;
};


const generatePDF = async () => {
  try {
    // Save to localStorage before generating PDF
    saveToLocalStorage();

    await downloadPDF(receipt.value);
    toast.add({
      title: "Receipt PDF Generated Successfully!",
      description: "Your receipt has been generated and downloaded.",
      icon: "i-lucide-file-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "PDF Generation Failed",
      description: "There was an error generating your receipt PDF. Please try again.",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  }
};

// Methods for PDF Preview
const generatePdfBlob = async (data: Receipt): Promise<Blob> => {
  const { generatePDF: generatePdfBlob } = useReceiptPdf();
  return await generatePdfBlob(data);
};

const handlePdfDownload = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Create consistent filename: Receipt_RCP-001_2025-01-09.pdf
  const docNumber = receipt.value.receiptNumber || "RCP-001";
  const date = receipt.value.date ? receipt.value.date.replace(/-/g, '-') : new Date().toISOString().split('T')[0];
  const filename = `Receipt_${docNumber}_${date}.pdf`;

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({
    title: "PDF Downloaded!",
    description: "Your receipt PDF has been downloaded.",
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
  const template = JSON.stringify(receipt.value, null, 2);

  // Save to localStorage
  localStorage.setItem("receiptTemplate", template);

  // Create and download JSON file
  const blob = new Blob([template], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-template-${receipt.value.receiptNumber || 'template'}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({
    title: "Template Saved!",
    description: "Your receipt template has been saved to localStorage and downloaded as a JSON file.",
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

          // Validate that this is a receipt template
          if (!loadedTemplate.receiptNumber && !loadedTemplate.businessName) {
            throw new Error("Invalid template format");
          }

          receipt.value = loadedTemplate;

          // If the loaded template doesn't have customFooterText, use our default
          if (!loadedTemplate.customFooterText) {
            receipt.value.customFooterText = "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";
          }

          // Update localStorage with the loaded template
          localStorage.setItem("receiptTemplate", template);

          toast.add({
            title: "Template Loaded!",
            description: "Your receipt template has been loaded and saved to localStorage.",
            icon: "i-lucide-folder-open",
            color: "success",
          });
        } catch {
          toast.add({
            title: "Invalid Template File",
            description: "This is not a valid receipt template file. Please select a .json file exported from the receipt form.",
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
  const savedTemplate = localStorage.getItem("receiptTemplate");
  if (savedTemplate) {
    try {
      const loadedTemplate = JSON.parse(savedTemplate);
      receipt.value = loadedTemplate;

      // Ensure customFooterText is set to our default if not present
      if (!loadedTemplate.customFooterText) {
        receipt.value.customFooterText = "If you have any questions, contact us at billing@example.com or call us at +60 3-0000 0000.";
      }
    } catch {
      // Template loading failed, continue with default values
    }
  }
});

</script>
