<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between text-white">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-list" class="w-5 h-5" />
          <h3 class="text-lg font-semibold text-white">Items</h3>
        </div>
        <UButton color="primary" size="sm" @click="addItem"> + Add Item </UButton>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Items Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="py-2 px-2 text-left text-gray-300 w-12">#</th>
              <th class="py-2 px-2 text-left text-gray-300">Description</th>
              <th v-if="showQuantity" class="py-2 px-2 text-left text-gray-300 w-24">Qty</th>
              <th v-if="showUnitPrice" class="py-2 px-2 text-left text-gray-300 w-24">Unit Price</th>
              <th class="py-2 px-2 text-left text-gray-300 w-24">Total</th>
              <th class="py-2 px-2 text-left text-gray-300 w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="index"
              class="border-b border-gray-700"
            >
              <td class="py-2 px-2 text-white align-top">{{ index + 1 }}</td>
              <td class="py-2 px-2 align-top">
                <UTextarea
                  :id="`description-${index}`"
                  v-model="item.description"
                  placeholder="Describe the service or product in detail"
                  class="w-full text-white min-h-[60px] resize-none border-gray-600 focus:border-blue-500 bg-gray-800"
                  :rows="3"
                />
              </td>
              <td v-if="showQuantity" class="py-2 px-2 align-top">
                <UInput
                  :id="`quantity-${index}`"
                  v-model.number="item.quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  class="w-full text-white"
                />
              </td>
              <td v-if="showUnitPrice" class="py-2 px-2 align-top">
                <UInput
                  :id="`unitPrice-${index}`"
                  v-model.number="item.unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full text-white"
                />
              </td>
              <td class="py-2 px-2 align-top">
                <UInput
                  :id="`total-${index}`"
                  v-model.number="item.total"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full text-white"
                />
              </td>
              <td class="py-2 px-2 align-top">
                <UButton
                  color="error"
                  variant="soft"
                  size="xs"
                  @click="removeItem(index)"
                >
                  <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Helper Text -->
      <div class="text-center">
        <p class="text-sm text-gray-400">
          💡
          <span class="cursor-pointer hover:text-gray-300" @click="addItem"
            >Click here to add more items</span
          >
          or
          <span
            class="cursor-pointer hover:text-gray-300"
            @click="focusInput('item-0')"
            >click on any item description to edit</span
          >
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
interface Item {
  description: string;
  quantity?: number;
  unitPrice?: number;
  total: number;
}

interface Props {
  modelValue: Item[];
  showQuantity?: boolean;
  showUnitPrice?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: Item[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  showQuantity: true,
  showUnitPrice: true,
});

const emit = defineEmits<Emits>();

const items = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Watch for changes to ensure totals are always numbers
watch(items, () => {
  // Ensure all totals are numbers
  items.value.forEach(item => {
    if (item.total !== undefined) {
      item.total = parseFloat(String(item.total)) || 0;
    }
  });
}, { deep: true });

const addItem = () => {
  const newItem: Item = {
    description: '',
    quantity: props.showQuantity ? 1 : undefined,
    unitPrice: props.showUnitPrice ? 0 : undefined,
    total: 0,
  };

  items.value = [...items.value, newItem];
};

const removeItem = (index: number) => {
  items.value = items.value.filter((_, i) => i !== index);
};

// Note: updateItem function removed as v-model handles updates directly

const focusInput = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.focus();
  }
};
</script>
