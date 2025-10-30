<!-- FormAudioUpload -->
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
      class="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Upload Area -->
    <div v-if="!preview" class="space-y-4">
      <div
        class="border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer"
        :class="
          error
            ? 'border-red-500'
            : 'border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400'
        "
        @click="triggerFileInput"
      >
        <div class="flex flex-col items-center gap-3">
          <i class="bi bi-cloud-upload text-4xl text-slate-400" />
          <div>
            <p class="text-sm font-medium text-slate-900 dark:text-slate-50">
              Klik untuk upload {{ label.toLowerCase() }}
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
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
        class="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-12 h-12 bg-sky-50 dark:bg-sky-950/30 rounded-xl flex items-center justify-center"
          >
            <i
              class="bi bi-music-note-beamed text-2xl text-sky-500 dark:text-sky-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-slate-900 dark:text-slate-50 truncate"
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
            class="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
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
        class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <i class="bi bi-check-circle text-emerald-500" />
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
  background-color: #f8fafc;
}

.dark audio::-webkit-media-controls-panel {
  background-color: #0f172a;
}
</style>
