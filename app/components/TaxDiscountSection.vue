<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-calculator" class="w-5 h-5" />
        <h3 class="text-lg font-semibold text-white">Tax & Discount</h3>
      </div>
    </template>

    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Tax Rate (%)" class="text-white flex flex-col gap-2">
          <p
            class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
            @click="focusInput('taxRate')"
          >
            Tax Rate (%)
          </p>
          <UInput
            id="taxRate"
            v-model="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0.00"
            class="text-white"
          />
        </UFormGroup>

        <UFormGroup label="Discount Rate (%)" class="text-white flex flex-col gap-2">
          <p
            class="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
            @click="focusInput('discountRate')"
          >
            Discount Rate (%)
          </p>
          <UInput
            id="discountRate"
            v-model="discountRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0.00"
            class="text-white"
          />
        </UFormGroup>
      </div>

      <div class="space-y-2 p-4 bg-gray-800 rounded-lg">
        <div class="flex justify-between">
          <span class="text-gray-300">Subtotal:</span>
          <span class="text-white">{{ formatCurrency(subtotal, currency) }}</span>
        </div>

        <!-- Only show discount if > 0 -->
        <div v-if="discountAmount > 0" class="flex justify-between">
          <span class="text-gray-300">Discount ({{ discountRate }}%):</span>
          <span class="text-red-400">-{{ formatCurrency(discountAmount, currency) }}</span>
        </div>

        <!-- Only show tax if > 0 -->
        <div v-if="taxAmount > 0" class="flex justify-between">
          <span class="text-gray-300">Tax ({{ taxRate }}%):</span>
          <span class="text-blue-400">{{ formatCurrency(taxAmount, currency) }}</span>
        </div>

        <div class="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
          <span class="text-white">Total:</span>
          <span class="text-white">{{ formatCurrency(totalAmount, currency) }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '~/composables/useDateUtils';

interface Props {
  subtotal: number;
  taxRate: string;
  discountRate: string;
  currency: string;
}

interface Emits {
  (e: 'update:taxRate' | 'update:discountRate', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed properties
const discountAmount = computed(() => {
  const rate = parseFloat(props.discountRate) || 0;
  return (props.subtotal * rate) / 100;
});

const taxAmount = computed(() => {
  const rate = parseFloat(props.taxRate) || 0;
  const taxableAmount = props.subtotal - discountAmount.value;
  return (taxableAmount * rate) / 100;
});

const totalAmount = computed(() => {
  return props.subtotal - discountAmount.value + taxAmount.value;
});

// Local reactive values for v-model
const taxRate = computed({
  get: () => props.taxRate,
  set: (value: string) => emit('update:taxRate', value)
});

const discountRate = computed({
  get: () => props.discountRate,
  set: (value: string) => emit('update:discountRate', value)
});

// Note: Amount calculations are now handled by the parent component
// This component only handles rate changes

// Helper function for input focus
const focusInput = (fieldId: string) => {
  const element = document.getElementById(fieldId);
  if (element) {
    element.focus();
  }
};
</script>
