<script setup>
const props = defineProps({
  progress: { type: Number, required: true },
  currentFile: { type: String, required: true },
});
</script>

<template>
  <div
    class="bg-sky-50 dark:bg-sky-950 rounded-3xl p-4 md:p-6 border border-sky-200 dark:border-sky-800"
  >
    <div class="flex items-center gap-3 mb-3">
      <div
        class="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
      ></div>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Mengkompresi Video...
        </h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 truncate">
          {{ currentFile }}
        </p>
      </div>
      <span class="text-lg font-bold text-sky-500 flex-shrink-0">
        {{ progress }}%
      </span>
    </div>
    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
      <div
        class="bg-sky-500 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
      💡 Video sedang dikompresi untuk hasil terbaik
    </p>
  </div>
</template>