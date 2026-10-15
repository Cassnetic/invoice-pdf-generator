<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-user" class="w-5 h-5" />
        <h3 class="text-lg font-semibold text-white">Client Information</h3>
      </div>
    </template>

    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Client Name" class="text-white">
          <UInput
            v-model="localClientName"
            placeholder="Client Full Name"
            class="w-full text-white"
          />
        </UFormGroup>

        <UFormGroup label="Client Company" class="text-white">
          <UInput
            v-model="localClientCompanyName"
            placeholder="Company Name"
            class="w-full text-white"
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Client Email" class="text-white">
          <UInput
            v-model="localClientEmail"
            type="email"
            placeholder="client@email.com"
            class="w-full text-white"
          />
        </UFormGroup>

        <UFormGroup label="Client Phone" class="text-white">
          <UInput
            v-model="localClientPhone"
            type="tel"
            placeholder="+1234567890"
            class="w-full text-white"
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Client Address" class="text-white">
        <UInput
          v-model="localClientAddressLine1"
          placeholder="Client Address Line 1"
          class="w-full text-white mb-2"
        />
        <UInput
          v-model="localClientAddressLine2"
          placeholder="Client Address Line 2"
          class="w-full text-white mb-2"
        />
        <UInput
          v-model="localClientAddressLine3"
          placeholder="Client Address Line 3"
          class="w-full text-white mb-2"
        />
        <UInput
          v-model="localClientAddressLine4"
          placeholder="Client Address Line 4"
          class="w-full text-white"
        />
      </UFormGroup>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Props {
  clientName?: string;
  clientCompanyName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddressLine1?: string;
  clientAddressLine2?: string;
  clientAddressLine3?: string;
  clientAddressLine4?: string;
}

interface Emits {
  (e: 'update:clientName' | 'update:clientCompanyName' | 'update:clientEmail' | 'update:clientPhone' | 'update:clientAddressLine1' | 'update:clientAddressLine2' | 'update:clientAddressLine3' | 'update:clientAddressLine4', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  clientName: "",
  clientCompanyName: "",
  clientEmail: "",
  clientPhone: "",
  clientAddressLine1: "",
  clientAddressLine2: "",
  clientAddressLine3: "",
  clientAddressLine4: "",
});

const emit = defineEmits<Emits>();

// Create reactive local state
const localClientName = ref(props.clientName || "");
const localClientCompanyName = ref(props.clientCompanyName || "");
const localClientEmail = ref(props.clientEmail || "");
const localClientPhone = ref(props.clientPhone || "");
const localClientAddressLine1 = ref(props.clientAddressLine1 || "");
const localClientAddressLine2 = ref(props.clientAddressLine2 || "");
const localClientAddressLine3 = ref(props.clientAddressLine3 || "");
const localClientAddressLine4 = ref(props.clientAddressLine4 || "");

// Watch for prop changes and update local values
watchEffect(() => {
  localClientName.value = props.clientName || "";
  localClientCompanyName.value = props.clientCompanyName || "";
  localClientEmail.value = props.clientEmail || "";
  localClientPhone.value = props.clientPhone || "";
  localClientAddressLine1.value = props.clientAddressLine1 || "";
  localClientAddressLine2.value = props.clientAddressLine2 || "";
  localClientAddressLine3.value = props.clientAddressLine3 || "";
  localClientAddressLine4.value = props.clientAddressLine4 || "";
});

// Watch for changes to local values and emit updates
watchEffect(() => {
  emit("update:clientName", localClientName.value);
  emit("update:clientCompanyName", localClientCompanyName.value);
  emit("update:clientEmail", localClientEmail.value);
  emit("update:clientPhone", localClientPhone.value);
  emit("update:clientAddressLine1", localClientAddressLine1.value);
  emit("update:clientAddressLine2", localClientAddressLine2.value);
  emit("update:clientAddressLine3", localClientAddressLine3.value);
  emit("update:clientAddressLine4", localClientAddressLine4.value);
});
</script>
