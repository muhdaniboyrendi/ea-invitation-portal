<script setup>
const props = defineProps({
  canAddMore: { type: Boolean, required: true },
  isCompressing: { type: Boolean, required: true },
  isDragging: { type: Boolean, required: true },
  remainingSlotsText: { type: [Number, String], required: true },
  maxVideosText: { type: [Number, String], required: true },
});

const emit = defineEmits(["select", "drop", "drag-over", "drag-leave"]);

const fileInput = ref(null);

const handleDrop = (event) => {
  emit("drop", event);
};

const handleDragOver = (event) => {
  emit("drag-over", event);
};

const handleDragLeave = (event) => {
  emit("drag-leave", event);
};

const handleFileSelect = (event) => {
  emit("select", event);
};

const openFilePicker = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    :class="[
      'border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-300',
      isDragging
        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950'
        : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600',
    ]"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="video/mp4,video/webm,video/ogg,video/quicktime"
      @change="handleFileSelect"
      class="hidden"
      :disabled="!canAddMore || isCompressing"
    />

    <div v-if="canAddMore && !isCompressing">
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
      >
        <i class="bi bi-cloud-arrow-up text-sky-500 text-3xl"></i>
      </div>
      <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
        Seret & Lepas video di sini
      </h4>
      <p class="text-xs text-slate-600 dark:text-slate-300 mb-4">
        atau klik tombol di bawah untuk memilih video
      </p>
      <button
        type="button"
        @click="openFilePicker"
        class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
      >
        <i class="bi bi-folder2-open mr-1"></i>
        Pilih Video
      </button>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-4">
        MP4, WEBM, OGG, MOV • Max 100MB • {{ remainingSlotsText }}
      </p>
    </div>

    <div v-else-if="isCompressing" class="text-slate-600 dark:text-slate-400">
      <div
        class="w-12 h-12 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-sm">Sedang mengkompresi video...</p>
    </div>

    <div v-else class="text-slate-600 dark:text-slate-400">
      <i class="bi bi-check-circle-fill text-4xl text-emerald-500 mb-2"></i>
      <p class="text-sm">Maksimal {{ maxVideosText }} video tercapai</p>
    </div>
  </div>
</template>
