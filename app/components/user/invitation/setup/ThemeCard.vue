<script setup>
const config = useRuntimeConfig();

const mainAppUrl = config.public.mainAppUrl;

const props = defineProps(["theme", "isSelected"]);
const emit = defineEmits(["selectTheme"]);

const selectTheme = () => {
  emit("selectTheme", props.theme);
};
</script>

<template>
  <div class="group relative w-full">
    <!-- Theme Card -->
    <div
      class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-103 hover:shadow-2xl"
    >
      <!-- Theme Preview Image -->
      <div class="relative h-fit overflow-hidden">
        <div class="p-4">
          <NuxtImg
            v-if="props.theme?.thumbnail_url"
            :src="props.theme?.thumbnail_url || '/img/hero.jpg'"
            :alt="props.theme?.name || 'Theme Image'"
            width="200"
            height="150"
            class="w-full aspect-4/3 object-cover object-center rounded-xl border border-slate-200 dark:border-slate-800"
            loading="lazy"
            format="webp"
          />
          <div
            v-else
            class="w-full aspect-4/3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          >
            <i class="bi bi-image text-6xl"></i>
            <span class="text-sm font-medium">No Image</span>
          </div>
        </div>

        <!-- Theme Type Badge -->
        <div v-if="props.theme?.is_premium" class="absolute top-6 right-6 z-10">
          <span
            class="px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg"
          >
            Premium
          </span>
        </div>
      </div>

      <!-- Theme Info -->
      <div class="p-4 pt-0">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">
              {{ props.theme?.name || "Untitled Theme" }}
            </h3>
          </div>
          <span
            class="py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
          >
            {{ props.theme?.theme_category?.name || "Uncategorized" }}
          </span>
        </div>

        <div class="space-y-4">
          <a
            :href="`${mainAppUrl}/themes/${props.theme?.slug}` || '#'"
            target="_blank"
            :rel="props.theme?.name || 'null'"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 dark:hover:from-sky-400 dark:hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span class="relative z-10">Lihat Tema</span>
            <i class="bi bi-box-arrow-up-right ml-2"></i>
          </a>
          <button
            @click="selectTheme"
            type="button"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            :class="
              props.isSelected
                ? 'from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 dark:hover:from-sky-400 dark:hover:to-sky-500'
                : 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-400 dark:hover:to-emerald-500'
            "
          >
            <i v-if="props.isSelected" class="bi bi-check-lg mr-2"></i>
            <span class="relative z-10">{{
              props.isSelected ? "Dipilih" : "Pilih Tema"
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
