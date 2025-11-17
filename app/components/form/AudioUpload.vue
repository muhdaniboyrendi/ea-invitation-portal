<script setup>
import { useAudioCompression } from '~/composables/useAudioCompression';

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
    default: "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/x-m4a,audio/mp4",
  },
  helpText: {
    type: String,
    default: "Format: MP3, WAV, OGG, M4A (Maks. 20MB)",
  },
  fileName: {
    type: String,
    default: "",
  },
  enableCompression: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["change", "remove", "error"]);

const { 
  compressAudio, 
  validateAudio, 
  getAudioDuration, 
  formatDuration 
} = useAudioCompression();

const fileInput = ref(null);
const audioPlayer = ref(null);

const compressionState = reactive({
  isCompressing: false,
  progress: 0,
  originalSize: 0,
  compressedSize: 0,
  compressionRatio: 0,
  duration: 0,
  showStats: false,
});

const handleChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validasi file
  const errors = validateAudio(file);
  if (errors.length > 0) {
    emit("error", errors[0]);
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    return;
  }

  // Get audio duration
  try {
    const duration = await getAudioDuration(file);
    compressionState.duration = duration;
  } catch (error) {
    console.warn('Could not get audio duration:', error);
  }

  // Jika kompresi diaktifkan
  if (props.enableCompression) {
    compressionState.isCompressing = true;
    compressionState.progress = 0;
    compressionState.originalSize = file.size;

    try {
      // Simulasi progress
      const progressInterval = setInterval(() => {
        if (compressionState.progress < 85) {
          compressionState.progress += 5;
        }
      }, 200);

      // Kompresi audio
      const compressedFile = await compressAudio(file);
      
      clearInterval(progressInterval);
      compressionState.progress = 100;

      // Hitung statistik
      compressionState.compressedSize = compressedFile.size;
      compressionState.compressionRatio = (
        (1 - compressedFile.size / file.size) * 100
      ).toFixed(0);
      compressionState.showStats = compressedFile.size < file.size; // Only show if actually compressed

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
        
        // Hide stats after 4 seconds
        if (compressionState.showStats) {
          setTimeout(() => {
            compressionState.showStats = false;
          }, 4000);
        }
      }, 500);

    } catch (error) {
      console.error("Compression error:", error);
      compressionState.isCompressing = false;
      
      // Jika kompresi gagal, tetap gunakan file original
      console.log("Using original file due to compression error");
      emit("change", event);
      
      // Show warning instead of error
      setTimeout(() => {
        compressionState.showStats = false;
      }, 100);
    }
  } else {
    // Langsung emit tanpa kompresi
    emit("change", event);
  }
};

const handleRemove = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
  }
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
            Mengoptimalkan Audio...
          </h4>
          <p class="text-xs text-slate-600 dark:text-slate-300">
            Mengkompresi untuk ukuran optimal
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
          compressionState.isCompressing ? 'pointer-events-none opacity-50' : ''
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
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Klik untuk upload {{ label.toLowerCase() }}
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ helpText }}
            </p>
            <p
              v-if="enableCompression"
              class="text-xs text-sky-600 dark:text-sky-400 mt-2 flex items-center justify-center gap-1"
            >
              <i class="bi bi-lightning-charge-fill"></i>
              Otomatis dioptimalkan (128 kbps)
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

      <!-- Audio Player Card -->
      <div
        class="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 transition-all duration-300 hover:border-sky-400 dark:hover:border-sky-600"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-12 h-12 bg-sky-100 dark:bg-sky-950/50 rounded-xl flex items-center justify-center shadow-sm"
          >
            <i
              class="bi bi-music-note-beamed text-2xl text-sky-600 dark:text-sky-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate"
                >
                  {{ fileName || "Audio file" }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    v-if="compressionState.duration > 0"
                    class="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1"
                  >
                    <i class="bi bi-clock"></i>
                    {{ formatDuration(compressionState.duration) }}
                  </span>
                  <span
                    v-if="enableCompression && compressionState.compressedSize > 0"
                    class="text-xs bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium"
                  >
                    128 kbps
                  </span>
                </div>
              </div>
              <button
                type="button"
                @click="handleRemove"
                class="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all"
                title="Hapus audio"
              >
                <i class="bi bi-trash text-lg" />
              </button>
            </div>
            <div class="mt-3">
              <audio
                ref="audioPlayer"
                :src="preview"
                controls
                class="w-full h-10 rounded-lg"
              >
                Browser Anda tidak mendukung audio player.
              </audio>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          type="button"
          @click="handleRemove"
          class="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
        >
          <i class="bi bi-arrow-repeat" />
          Ubah Audio
        </button>
      </div>

      <!-- Success Message -->
      <div
        class="flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800"
      >
        <i class="bi bi-check-circle-fill" />
        <span class="font-medium">{{ label }} berhasil diupload</span>
      </div>
    </div>

    <!-- Error Message -->
    <Transition name="fade">
      <div
        v-if="error"
        class="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl"
      >
        <p class="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
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

/* Custom audio player styling */
audio {
  outline: none;
  border-radius: 0.5rem;
}

audio::-webkit-media-controls-panel {
  background-color: #ffffff;
  border-radius: 0.5rem;
}

.dark audio::-webkit-media-controls-panel {
  background-color: #0f172a;
}

audio::-webkit-media-controls-play-button {
  background-color: #0ea5e9;
  border-radius: 50%;
}

audio::-webkit-media-controls-play-button:hover {
  background-color: #0284c7;
}
</style>