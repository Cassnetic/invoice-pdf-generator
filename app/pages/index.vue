<template>
  <div class="min-h-screen bg-gray-900 p-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Document Generator</h1>
        <p class="text-gray-300">
          Create professional quotations, invoices, and receipts with flexible customization
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8">
        <div class="flex justify-center space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            v-for="(item, index) in tabItems"
            :key="index"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
              activeTab === index
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
            @click="activeTab = index"
          >
            <UIcon :name="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.label }}</span>
          </button>
            </div>
              </div>

      <!-- Tab Content -->
      <div>
        <!-- Quotation Tab Content -->
        <div v-if="activeTab === 0">
          <QuotationForm />
        </div>

        <!-- Invoice Tab Content -->
        <div v-else-if="activeTab === 1">
          <InvoiceForm />
              </div>

        <!-- Receipt Tab Content -->
        <div v-else-if="activeTab === 2">
          <ReceiptForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Import components
import QuotationForm from '~/components/QuotationForm.vue';
import InvoiceForm from '~/components/InvoiceForm.vue';
import ReceiptForm from '~/components/ReceiptForm.vue';

// Tab management
const activeTab = ref(0);
const tabItems = [
  { label: 'Quotation', icon: 'i-lucide-file-text' },
  { label: 'Invoice', icon: 'i-lucide-receipt' },
  { label: 'Receipt', icon: 'i-lucide-credit-card' }
];

// Set page title
useHead({
  title: 'Invoice, Quotation and Receipt Generator'
});
</script>