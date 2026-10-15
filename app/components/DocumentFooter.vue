<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-message-square" class="w-5 h-5" />
        <h3 class="text-lg font-semibold text-white">Footer Information</h3>
      </div>
    </template>

    <div class="space-y-4">
      <p class="text-xs text-gray-400 mt-1">
        This message will appear at the bottom of your PDF documents.
      </p>
      <UFormGroup label="Footer Message" class="text-white">
        <UTextarea
          v-model="localCustomText"
          placeholder="Enter your custom footer message..."
          class="w-full text-white min-h-[80px] resize-none border-gray-600 focus:border-blue-500 bg-gray-800"
          :rows="3"
        />
      </UFormGroup>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

interface Props {
  businessEmail?: string;
  businessPhone?: string;
  customText?: string;
}

interface Emits {
  (
    e: "update:businessEmail" | "update:businessPhone" | "update:customText",
    value: string
  ): void;
}

const props = withDefaults(defineProps<Props>(), {
  businessEmail: "",
  businessPhone: "",
  customText: "If you have any question, please email billing@example.com or call us at +60 3-0000 0000.",
});

const emit = defineEmits<Emits>();

const localBusinessEmail = ref(props.businessEmail || "");
const localBusinessPhone = ref(props.businessPhone || "");
const localCustomText = ref(props.customText || "");

const updateFooter = () => {
  emit("update:businessEmail", localBusinessEmail.value);
  emit("update:businessPhone", localBusinessPhone.value);
  emit("update:customText", localCustomText.value);
};

// Watch for prop changes
watch(
  () => props.businessEmail,
  (newValue) => {
    localBusinessEmail.value = newValue || "";
  }
);

watch(
  () => props.businessPhone,
  (newValue) => {
    localBusinessPhone.value = newValue || "";
  }
);

watch(
  () => props.customText,
  (newValue) => {
    localCustomText.value = newValue || "";
  }
);

// Watch for changes to localCustomText and emit updates immediately
watch(
  () => localCustomText.value,
  () => {
    updateFooter();
  },
  { immediate: false }
);

// Ensure proper initialization on mount
onMounted(() => {
  localBusinessEmail.value = props.businessEmail || "";
  localBusinessPhone.value = props.businessPhone || "";
  localCustomText.value = props.customText || "";
});
</script>
