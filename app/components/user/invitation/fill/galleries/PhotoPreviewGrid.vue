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
        Preview ({{ previews.length }} foto)
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

    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      <div
        v-for="(preview, index) in previews"
        :key="preview.id"
        class="group relative aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
      >
        <img
          :src="preview.url"
          :alt="preview.name"
          class="w-full h-full object-cover"
        />
        <button
          type="button"
          @click="handleRemove(index)"
          :disabled="isCompressing"
          class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 active:scale-95 disabled:opacity-50 flex items-center justify-center"
          title="Hapus"
        >
          <i class="bi bi-trash text-xs"></i>
        </button>
        
        <!-- Size Info Overlay -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div class="flex items-center justify-center gap-1">
            <span class="text-red-300">{{ preview.originalSize }}MB</span>
            <span class="text-emerald-400">→</span>
            <span class="text-emerald-300">{{ preview.compressedSize }}MB</span>
          </div>
          <div class="text-center mt-0.5">
            <span class="bg-emerald-500/90 px-1.5 py-0.5 rounded text-xs font-semibold">
              -{{ preview.compressionRatio }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>