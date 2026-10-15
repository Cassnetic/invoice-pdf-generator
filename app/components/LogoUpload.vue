<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-image" class="w-5 h-5" />
        <h3 class="text-lg font-semibold text-white">Business Logo</h3>
      </div>
    </template>

    <div class="space-y-4">
      <!-- File Upload -->
      <UFileUpload
        v-model="logoFile"
        accept="image/*"
        :max-size="2 * 1024 * 1024"
        placeholder="Choose logo file..."
        class="text-white"
      />

      <p class="text-sm text-gray-400">
        Upload your business logo (PNG, JPG, GIF up to 2MB)
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: string | null;
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const toast = useToast();

// File input ref
const logoFile = ref<File | undefined>(undefined);

// Logo handling
const handleLogoUpload = (event: Event | File) => {
  let file: File | null | undefined = null;

  if (event instanceof File) {
    // UFileUpload with v-model passes File directly
    file = event;
  } else if (event instanceof Event) {
    // Traditional file input passes Event
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      file = target.files[0];
    }
  }

  if (!file) {
    return;
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      title: "File Too Large",
      description: "Logo file must be smaller than 2MB",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.add({
      title: "Invalid File Type",
      description: "Please upload an image file (PNG, JPG, GIF)",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;

    if (result) {
      emit('update:modelValue', result);
      toast.add({
        title: "Logo Uploaded!",
        description: "Your business logo has been uploaded successfully.",
        icon: "i-lucide-check-circle",
        color: "success",
      });
    } else {
      toast.add({
        title: "Upload Failed",
        description: "Failed to process the logo file. Please try again.",
        icon: "i-lucide-alert-circle",
        color: "error",
      });
    }
  };

  reader.onerror = () => {
    toast.add({
      title: "Upload Failed",
      description: "Failed to read the logo file. Please try again.",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  };

  reader.readAsDataURL(file);
};

// Watch for logoFile changes (UFileUpload v-model)
watch(
  () => logoFile.value,
  (newFile, oldFile) => {
    if (newFile) {
      handleLogoUpload(newFile);
    } else if (newFile === undefined && oldFile) {
      // File was removed, clear the logo
      emit('update:modelValue', null);
      toast.add({
        title: "Logo Removed!",
        description: "Your business logo has been removed.",
        icon: "i-lucide-image-off",
        color: "info",
      });
    }
  }
);
</script>
