<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  preview: {
    type: String,
    default: null,
  },
  acceptedFormats: {
    type: String,
    default: "image/jpeg,image/jpg,image/png,image/webp",
  },
  helpText: {
    type: String,
    default: "Format: JPG, PNG, WebP (Maks. 5MB)",
  },
});

const emit = defineEmits(["change", "remove"]);

const fileInput = ref(null);

const handleChange = (event) => {
  emit("change", event);
};

const handleRemove = () => {
  emit("remove");
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

defineExpose({
  fileInput,
});
</script>

<template>
  <div>
    <label
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Upload Area -->
    <div v-if="!preview" class="space-y-4">
      <div
        class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
        :class="
          error
            ? 'border-red-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
        "
        @click="triggerFileInput"
      >
        <div class="flex flex-col items-center gap-3">
          <i class="bi bi-cloud-upload text-4xl text-gray-400" />
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Klik untuk upload {{ label.toLowerCase() }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ helpText }}
            </p>
          </div>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        :accept="acceptedFormats"
        @change="handleChange"
        class="hidden"
      />
    </div>

    <!-- Preview -->
    <div v-else class="relative">
      <div
        class="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
      >
        <NuxtImg
          :src="preview"
          :alt="`${label} preview`"
          width="200"
          height="150"
          class="w-full aspect-[4/3] object-cover"
        />
      </div>
      <button
        type="button"
        @click="handleRemove"
        class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <i class="bi bi-x text-lg" />
      </button>
      <div
        class="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <i class="bi bi-check-circle text-green-500" />
        <span>{{ label }} berhasil diupload</span>
      </div>
    </div>

    <Transition name="fade">
      <p v-if="error" class="text-red-500 text-sm mt-1 flex items-center gap-1">
        <i class="bi bi-exclamation-circle" />
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
