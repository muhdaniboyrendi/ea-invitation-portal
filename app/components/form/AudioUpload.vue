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
    default: "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a",
  },
  helpText: {
    type: String,
    default: "Format: MP3, WAV, OGG, M4A (Maks. 20MB)",
  },
  fileName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["change", "remove"]);

const fileInput = ref(null);
const audioPlayer = ref(null);

const handleChange = (event) => {
  emit("change", event);
};

const handleRemove = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
  }
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
    <div v-else class="space-y-3">
      <div
        class="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
          >
            <i
              class="bi bi-music-note-beamed text-2xl text-purple-600 dark:text-purple-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
            >
              {{ fileName || "Audio file" }}
            </p>
            <div class="mt-2">
              <audio
                ref="audioPlayer"
                :src="preview"
                controls
                class="w-full h-10"
                style="max-width: 100%"
              >
                Browser Anda tidak mendukung audio player.
              </audio>
            </div>
          </div>
          <button
            type="button"
            @click="handleRemove"
            class="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Hapus audio"
          >
            <i class="bi bi-trash text-lg" />
          </button>
        </div>
      </div>

      <button
        type="button"
        @click="handleRemove"
        class="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        Ubah Audio
        <i class="bi bi-arrow-repeat" />
      </button>

      <div
        class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
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

/* Custom audio player styling */
audio {
  outline: none;
}

audio::-webkit-media-controls-panel {
  background-color: #f9fafb;
}

.dark audio::-webkit-media-controls-panel {
  background-color: #1f2937;
}
</style>
