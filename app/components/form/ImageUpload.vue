<script setup>
const props = defineProps({
  label: {
    type: String,
    required: false,
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
  enableCompression: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["change", "remove", "error"]);

const { compressImageToWebP, validateImage } = useImageCompression();

const fileInput = ref(null);
const compressionState = reactive({
  isCompressing: false,
  progress: 0,
  originalSize: 0,
  compressedSize: 0,
  compressionRatio: 0,
  showStats: false,
});

const handleChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validasi file
  const errors = validateImage(file);
  if (errors.length > 0) {
    emit("error", errors[0]);
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    return;
  }

  // Jika kompresi diaktifkan
  if (props.enableCompression) {
    compressionState.isCompressing = true;
    compressionState.progress = 0;
    compressionState.originalSize = file.size;

    try {
      // Simulasi progress
      const progressInterval = setInterval(() => {
        if (compressionState.progress < 90) {
          compressionState.progress += 10;
        }
      }, 100);

      // Kompresi gambar
      const compressedFile = await compressImageToWebP(file);

      clearInterval(progressInterval);
      compressionState.progress = 100;

      // Hitung statistik
      compressionState.compressedSize = compressedFile.size;
      compressionState.compressionRatio = (
        (1 - compressedFile.size / file.size) *
        100
      ).toFixed(0);
      compressionState.showStats = true;

      // Buat event baru dengan file yang sudah dikompres
      const newEvent = {
        ...event,
        target: {
          ...event.target,
          files: [compressedFile],
        },
      };

      // Emit setelah delay singkat untuk menampilkan stats
      setTimeout(() => {
        emit("change", newEvent);
        compressionState.isCompressing = false;

        // Hide stats after 3 seconds
        setTimeout(() => {
          compressionState.showStats = false;
        }, 3000);
      }, 500);
    } catch (error) {
      console.error("Compression error:", error);
      compressionState.isCompressing = false;
      emit("error", error.message || "Gagal mengkompresi gambar");

      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }
  } else {
    // Langsung emit tanpa kompresi
    emit("change", event);
  }
};

const handleRemove = () => {
  compressionState.showStats = false;
  compressionState.progress = 0;
  emit("remove");
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const formatFileSize = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

defineExpose({
  fileInput,
});
</script>

<template>
  <div>
    <label
      v-if="props.label"
      class="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Compression Progress -->
    <div
      v-if="compressionState.isCompressing"
      class="bg-sky-50 dark:bg-sky-950 rounded-2xl p-4 mb-4 border border-sky-200 dark:border-sky-800"
    >
      <div class="flex items-center gap-3 mb-3">
        <div
          class="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
        ></div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Mengoptimalkan Gambar...
          </h4>
          <p class="text-xs text-slate-600 dark:text-slate-300">
            Mengkonversi ke WebP untuk kualitas terbaik
          </p>
        </div>
        <span class="text-lg font-bold text-sky-500 flex-shrink-0">
          {{ compressionState.progress }}%
        </span>
      </div>
      <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          class="bg-sky-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${compressionState.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Upload Area -->
    <div v-if="!preview" class="space-y-4">
      <div
        class="border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-300 cursor-pointer group"
        :class="[
          error
            ? 'border-red-500 bg-red-50 dark:bg-red-950'
            : 'border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950',
          compressionState.isCompressing
            ? 'pointer-events-none opacity-50'
            : '',
        ]"
        @click="triggerFileInput"
      >
        <div class="flex flex-col items-center gap-3">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors"
            :class="
              error
                ? 'bg-red-100 dark:bg-red-900'
                : 'bg-sky-50 dark:bg-sky-950 group-hover:bg-sky-100 dark:group-hover:bg-sky-900'
            "
          >
            <i
              class="bi bi-cloud-upload text-3xl transition-colors"
              :class="error ? 'text-red-500' : 'text-sky-500'"
            />
          </div>
          <div>
            <p
              class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1"
            >
              Klik untuk upload gambar
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ helpText }}
            </p>
            <p
              v-if="enableCompression"
              class="text-xs text-sky-600 dark:text-sky-400 mt-2 flex items-center justify-center gap-1"
            >
              <i class="bi bi-lightning-charge-fill"></i>
              Otomatis dioptimalkan ke WebP
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
        :disabled="compressionState.isCompressing"
      />
    </div>

    <!-- Preview with Stats -->
    <div v-else class="space-y-3">
      <!-- Stats Banner (if compression was used) -->
      <Transition name="slide-down">
        <div
          v-if="compressionState.showStats && enableCompression"
          class="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-3 border border-emerald-200 dark:border-emerald-800"
        >
          <div class="flex items-center gap-2 mb-2">
            <i class="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
            <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Optimasi Berhasil!
            </h4>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="bg-white dark:bg-slate-900 rounded-lg p-2 text-center">
              <p class="text-slate-500 dark:text-slate-400 mb-1">Original</p>
              <p class="font-bold text-slate-900 dark:text-slate-50">
                {{ formatFileSize(compressionState.originalSize) }} MB
              </p>
            </div>
            <div class="bg-white dark:bg-slate-900 rounded-lg p-2 text-center">
              <p class="text-slate-500 dark:text-slate-400 mb-1">Dikompresi</p>
              <p class="font-bold text-emerald-600 dark:text-emerald-400">
                {{ formatFileSize(compressionState.compressedSize) }} MB
              </p>
            </div>
            <div class="bg-white dark:bg-slate-900 rounded-lg p-2 text-center">
              <p class="text-slate-500 dark:text-slate-400 mb-1">Hemat</p>
              <p class="font-bold text-sky-600 dark:text-sky-400">
                {{ compressionState.compressionRatio }}%
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Image Preview -->
      <div class="relative group">
        <div
          class="border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-sky-400 dark:group-hover:border-sky-600"
        >
          <NuxtImg
            :src="preview"
            :alt="`${label} preview`"
            width="400"
            height="300"
            class="w-full aspect-[4/3] object-cover"
          />
        </div>

        <!-- Overlay buttons -->
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-2xl flex items-center justify-center"
        >
          <button
            type="button"
            @click="handleRemove"
            class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <i class="bi bi-arrow-repeat"></i>
            Ubah Gambar
          </button>
        </div>

        <!-- Success badge -->
        <div
          class="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg"
        >
          <i class="bi bi-check-circle-fill"></i>
          <span>Berhasil diupload</span>
        </div>

        <!-- WebP badge (if compressed) -->
        <div
          v-if="enableCompression && compressionState.compressedSize > 0"
          class="absolute top-3 right-3 bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg"
        >
          <i class="bi bi-lightning-charge-fill"></i>
          <span>WebP</span>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <Transition name="fade">
      <div
        v-if="error"
        class="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl"
      >
        <p
          class="text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
        >
          <i class="bi bi-exclamation-circle-fill"></i>
          {{ error }}
        </p>
      </div>
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
