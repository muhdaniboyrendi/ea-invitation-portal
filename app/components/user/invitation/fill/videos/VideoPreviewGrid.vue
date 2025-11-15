<script setup>
const props = defineProps({
  previews: { type: Array, required: true },
  isCompressing: { type: Boolean, required: true },
});

const emit = defineEmits(["remove", "clear-all"]);

const handleRemove = (index) => {
  emit("remove", index);
};

const handleClearAll = () => {
  emit("clear-all");
};
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="text-xs font-semibold text-slate-900 dark:text-slate-50">
        Preview ({{ previews.length }} video)
      </h4>
      <button
        type="button"
        @click="handleClearAll"
        :disabled="isCompressing"
        class="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50 transition-colors"
      >
        <i class="bi bi-x-circle mr-1"></i>
        Hapus Semua
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="(preview, index) in previews"
        :key="preview.id"
        class="group relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
      >
        <video
          :src="preview.url"
          class="w-full h-full object-cover"
          controls
          preload="metadata"
        ></video>
        <button
          type="button"
          @click="handleRemove(index)"
          :disabled="isCompressing"
          class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
          title="Hapus"
        >
          <i class="bi bi-trash text-xs"></i>
        </button>
        <div
          class="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white text-xs p-2"
        >
          <p class="truncate font-medium mb-1">{{ preview.name }}</p>
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-300 flex items-center gap-1">
              <i class="bi bi-file-earmark text-red-400"></i>
              {{ preview.originalSize }} MB
            </span>
            <span class="text-emerald-400">→</span>
            <span class="text-emerald-300 flex items-center gap-1">
              <i class="bi bi-file-earmark-check text-emerald-400"></i>
              {{ preview.compressedSize }} MB
            </span>
          </div>
          <div class="mt-1 text-center">
            <span
              class="bg-emerald-500/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              🎉 Hemat {{ preview.compressionRatio }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>