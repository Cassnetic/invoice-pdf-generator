<template>
  <UModal v-model:open="isDialogOpen" :title="`${documentType} Preview`" class="w-[80vw] max-w-none">

    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-file-text" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">{{ documentType }} Preview</h3>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            variant="outline"
            size="sm"
            :loading="isGenerating"
            :disabled="isGenerating"
            @click="refreshPreview"
          >
            <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 mr-1" />
            Refresh
          </UButton>
          <UButton
            variant="outline"
            size="sm"
            :loading="isDownloading"
            :disabled="isDownloading || !pdfBlob"
            @click="downloadPDF"
          >
            <UIcon name="i-lucide-download" class="w-4 h-4 mr-1" />
            Download
          </UButton>
        </div>
      </div>
    </template>

    <template #body>
      <!-- Preview Container -->
      <div class="relative">
        <div
          v-if="isGenerating"
          class="flex items-center justify-center h-[70vh] bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="text-center">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p class="text-gray-600">Generating PDF preview...</p>
          </div>
        </div>

        <div
          v-else-if="error"
          class="flex items-center justify-center h-[70vh] bg-red-50 rounded-lg border border-red-200"
        >
          <div class="text-center">
            <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p class="text-red-600">{{ error }}</p>
            <UButton
              variant="outline"
              size="sm"
              class="mt-2"
              @click="refreshPreview"
            >
              Try Again
            </UButton>
          </div>
        </div>

        <div
          v-else-if="pdfBlob"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <iframe
            :src="pdfUrl"
            class="w-full h-[70vh] border-0"
            title="PDF Preview"
          />
        </div>

        <div
          v-else
          class="flex items-center justify-center h-[70vh] bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="text-center">
            <UIcon name="i-lucide-file-text" class="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p class="text-gray-600">No preview available</p>
            <p class="text-sm text-gray-500 mt-1">Click "Refresh" to generate preview</p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  documentType: 'quotation' | 'invoice' | 'receipt'
  documentData: unknown
  generatePdfFunction: (data: never) => Promise<Blob>
  autoRefresh?: boolean
  refreshTrigger?: unknown
}

const props = withDefaults(defineProps<Props>(), {
  autoRefresh: true,
  refreshTrigger: null
})

const emit = defineEmits<{
  download: [blob: Blob]
}>()

// State
const pdfBlob = ref<Blob | null>(null)
const pdfUrl = ref<string>('')
const isGenerating = ref(false)
const isDownloading = ref(false)
const error = ref<string>('')
const isDialogOpen = ref(false)

// Computed
const documentType = computed(() => {
  return props.documentType.charAt(0).toUpperCase() + props.documentType.slice(1)
})

// Methods
const generatePreview = async () => {
  if (!props.documentData || !props.generatePdfFunction) return

  try {
    isGenerating.value = true
    error.value = ''

    const blob = await props.generatePdfFunction(props.documentData)
    pdfBlob.value = blob

    // Create object URL for iframe
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }
    pdfUrl.value = URL.createObjectURL(blob)

  } catch (err) {
    console.error('Error generating PDF preview:', err)
    error.value = 'Failed to generate PDF preview. Please check your data and try again.'
    pdfBlob.value = null
    pdfUrl.value = ''
  } finally {
    isGenerating.value = false
  }
}

const refreshPreview = () => {
  generatePreview()
}

const openModal = () => {
  isDialogOpen.value = true
  // Always refresh preview when modal opens to get latest data
  generatePreview()
}

// Expose methods for parent components
defineExpose({
  openModal
})

const downloadPDF = async () => {
  if (!pdfBlob.value) return

  try {
    isDownloading.value = true
    emit('download', pdfBlob.value)
  } catch (err) {
    console.error('Error downloading PDF:', err)
  } finally {
    isDownloading.value = false
  }
}

// Watchers
watch(
  () => isDialogOpen.value,
  (isOpen) => {
    if (isOpen && !pdfBlob.value) {
      // Generate preview when modal opens and we don't have one yet
      generatePreview()
    }
  }
)

watch(
  () => props.documentData,
  () => {
    if (props.autoRefresh && isDialogOpen.value) {
      // Only generate preview if dialog is open
      generatePreview()
    }
  },
  { deep: true }
)

watch(
  () => props.refreshTrigger,
  () => {
    if (props.autoRefresh && isDialogOpen.value) {
      // Only generate preview if dialog is open
      generatePreview()
    }
  }
)

// Lifecycle
onMounted(() => {
  // Don't auto-generate on mount, wait for user to click preview
})

onUnmounted(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
})
</script>
