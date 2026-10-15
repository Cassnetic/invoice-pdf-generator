<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-building" class="w-5 h-5 text-white" />
        <h3 class="text-lg font-semibold text-white">Business Information</h3>
      </div>
    </template>

    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-4">
        <UFormGroup label="Business Name" class="text-white">
          <UInput
            v-model="localBusinessName"
            placeholder="Your Company Name"
            class="w-full text-white"
          />
        </UFormGroup>

        <UFormGroup label="Business Email" class="text-white">
          <UInput
            v-model="localBusinessEmail"
            type="email"
            placeholder="contact@company.com"
            class="w-full text-white"
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <UFormGroup label="Business Phone" class="text-white">
          <UInput
            v-model="localBusinessPhone"
            type="tel"
            placeholder="+1234567890"
            class="w-full text-white"
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Business Address" class="text-white">
        <UInput
          v-model="localBusinessAddressLine1"
          placeholder="Business Address Line 1"
          class="w-full text-white mb-2"
        />
        <UInput
          v-model="localBusinessAddressLine2"
          placeholder="Business Address Line 2"
          class="w-full text-white mb-2"
        />
        <UInput
          v-model="localBusinessAddressLine3"
          placeholder="Business Address Line 3"
          class="w-full text-white mb-2"
        />
        <UInput
          v-model="localBusinessAddressLine4"
          placeholder="Business Address Line 4"
          class="w-full text-white"
        />
      </UFormGroup>

      <div class="grid grid-cols-1 gap-2 mt-2">
        <UFormGroup label="Business Registration Number" class="text-white">
          <UInput
            v-model="localBusinessLicense"
            placeholder="Business Registration Number"
            class="w-full text-white"
          />
        </UFormGroup>

        <UFormGroup label="Website" class="text-white">
          <UInput
            v-model="localWebsite"
            type="url"
            placeholder="https://yourcompany.com"
            class="w-full text-white"
          />
        </UFormGroup>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Props {
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessTaxId?: string;
  businessAddressLine1?: string;
  businessAddressLine2?: string;
  businessAddressLine3?: string;
  businessAddressLine4?: string;
  businessLicense?: string;
  website?: string;
}

interface Emits {
  (
    e:
      | "update:businessName"
      | "update:businessEmail"
      | "update:businessPhone"
      | "update:businessTaxId"
      | "update:businessAddressLine1"
      | "update:businessAddressLine2"
      | "update:businessAddressLine3"
      | "update:businessAddressLine4"
      | "update:businessLicense"
      | "update:website",
    value: string
  ): void;
}

const props = withDefaults(defineProps<Props>(), {
  businessName: "",
  businessEmail: "",
  businessPhone: "",
  businessTaxId: "",
  businessAddressLine1: "",
  businessAddressLine2: "",
  businessAddressLine3: "",
  businessAddressLine4: "",
  businessLicense: "",
  website: "",
});

const emit = defineEmits<Emits>();

// Create reactive local state
const localBusinessName = ref(props.businessName || "");
const localBusinessEmail = ref(props.businessEmail || "");
const localBusinessPhone = ref(props.businessPhone || "");
const localBusinessTaxId = ref(props.businessTaxId || "");
const localBusinessAddressLine1 = ref(props.businessAddressLine1 || "");
const localBusinessAddressLine2 = ref(props.businessAddressLine2 || "");
const localBusinessAddressLine3 = ref(props.businessAddressLine3 || "");
const localBusinessAddressLine4 = ref(props.businessAddressLine4 || "");
const localBusinessLicense = ref(props.businessLicense || "");
const localWebsite = ref(props.website || "");

// Watch for prop changes and update local values
watchEffect(() => {
  localBusinessName.value = props.businessName || "";
  localBusinessEmail.value = props.businessEmail || "";
  localBusinessPhone.value = props.businessPhone || "";
  localBusinessTaxId.value = props.businessTaxId || "";
  localBusinessAddressLine1.value = props.businessAddressLine1 || "";
  localBusinessAddressLine2.value = props.businessAddressLine2 || "";
  localBusinessAddressLine3.value = props.businessAddressLine3 || "";
  localBusinessAddressLine4.value = props.businessAddressLine4 || "";
  localBusinessLicense.value = props.businessLicense || "";
  localWebsite.value = props.website || "";
});

// Watch for changes to local values and emit updates
watchEffect(() => {
  emit("update:businessName", localBusinessName.value);
  emit("update:businessEmail", localBusinessEmail.value);
  emit("update:businessPhone", localBusinessPhone.value);
  emit("update:businessTaxId", localBusinessTaxId.value);
  emit("update:businessAddressLine1", localBusinessAddressLine1.value);
  emit("update:businessAddressLine2", localBusinessAddressLine2.value);
  emit("update:businessAddressLine3", localBusinessAddressLine3.value);
  emit("update:businessAddressLine4", localBusinessAddressLine4.value);
  emit("update:businessLicense", localBusinessLicense.value);
  emit("update:website", localWebsite.value);
});
</script>
