<script setup>
const props = defineProps(["theme", "isSelected"]);
const emit = defineEmits(["selectTheme"]);

const selectTheme = () => {
  emit("selectTheme", props.theme);
};
</script>

<template>
  <div class="group relative w-full max-w-70">
    <!-- Theme Card -->
    <div
      class="relative bg-white dark:bg-dark border border-white/10 hover:border-white/20 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-103 hover:shadow-2xl"
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
            class="w-full aspect-4/3 object-cover object-center rounded-xl border border-white/10"
            loading="lazy"
            format="webp"
          />
          <div
            v-else
            class="w-full aspect-4/3 rounded-xl border border-white/10 flex flex-col justify-center items-center bg-zinc-400 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600"
          >
            <i class="bi bi-image text-6xl"></i>
            <span class="text-sm font-medium">No Image</span>
          </div>
        </div>

        <!-- Theme Type Badge -->
        <div v-if="props.theme?.is_premium" class="absolute top-6 right-6 z-10">
          <span
            class="px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
          >
            Premium
          </span>
        </div>
      </div>

      <!-- Theme Info -->
      <div class="p-4 pt-0">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-dark dark:text-white">
              {{ props.theme?.name || "Untitled Theme" }}
            </h3>
          </div>
          <span
            class="py-1 px-2 rounded-lg bg-black/15 dark:bg-white/10 text-sm text-black/80 dark:text-white/80"
          >
            {{ props.theme?.theme_category?.name || "Uncategorized" }}
          </span>
        </div>

        <div class="space-y-4">
          <a
            :href="props.theme?.link || '#'"
            target="_blank"
            :rel="props.theme?.name || 'null'"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
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
                ? 'from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400'
                : 'from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400'
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
