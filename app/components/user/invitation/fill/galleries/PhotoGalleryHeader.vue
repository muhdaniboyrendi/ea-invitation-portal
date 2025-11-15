<script setup>
const props = defineProps({
  photoCount: { type: Number, required: true },
  maxImages: { type: Number, required: true },
  hasImageLimit: { type: Boolean, required: true },
});
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
        >
          <i class="bi bi-images text-sky-500 text-lg"></i>
        </div>
        <div>
          <h2
            class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
          >
            Galeri Foto
          </h2>
          <p class="text-xs text-slate-600 dark:text-slate-300">
            {{ photoCount }} foto{{ hasImageLimit ? ` / ${maxImages}` : "" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>