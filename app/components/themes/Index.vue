<script setup>
const { user } = storeToRefs(useAuthStore());
const { themes, themesPending } = storeToRefs(useThemeStore());
const { categories, categoriesPending } = storeToRefs(useThemeCategoryStore());

const activeCategory = ref("all");
const scrollContainer = ref(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

// Computed filtered themes
const filteredThemes = computed(() => {
  if (!themes.value || themes.value.length === 0) {
    return [];
  }

  if (activeCategory.value === "all") {
    return themes.value;
  }
  return themes.value.filter(
    (theme) => theme.theme_category_id === activeCategory.value
  );
});

// Get theme count for category
const getThemeCount = (categoryId) => {
  if (!themes.value || !Array.isArray(themes.value)) {
    return 0;
  }

  if (categoryId === "all") {
    return themes.value.length;
  }

  return themes.value.filter((theme) => theme.theme_category_id === categoryId)
    .length;
};

// Get current category name for empty state
const getCurrentCategoryName = computed(() => {
  if (activeCategory.value === "all") {
    return "Semua Tema";
  }

  const categoryList =
    categories.value && categories.value.length > 0 ? categories.value : [];

  const category = categoryList.find((cat) => cat.id === activeCategory.value);
  return category ? category.name : "Kategori";
});

// Check scroll position to show/hide arrows
const checkScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  showLeftArrow.value = scrollLeft > 0;
  showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10;
};

// Smooth scroll functions
const scrollLeft = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({ left: -200, behavior: "smooth" });
};

const scrollRight = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({ left: 200, behavior: "smooth" });
};

// Auto-scroll to active category
const scrollToActive = () => {
  if (!scrollContainer.value) return;

  nextTick(() => {
    const activeButton =
      scrollContainer.value.querySelector(".active-category");
    if (activeButton) {
      const containerWidth = scrollContainer.value.clientWidth;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      scrollContainer.value.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  });
};

// Watch for category changes
watch(activeCategory, () => {
  scrollToActive();
});

onMounted(() => {
  checkScroll();
  scrollToActive();

  // Add scroll listener
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", checkScroll);
  }

  // Check on window resize
  window.addEventListener("resize", checkScroll);
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", checkScroll);
  }
  window.removeEventListener("resize", checkScroll);
});
</script>

<template>
  <div class="space-y-6">
    <Header
      title="Tema Undangan"
      subtitle="Daftar tema undangan yang tersedia untuk undangan anda."
      button-text="Tambah Tema"
      :has-button="user?.role == 'admin' ? true : false"
      button-link="/themes/create"
      icon="bi-palette2"
    />

    <!-- Category Header -->
    <div
      v-if="user?.role == 'admin'"
      class="flex flex-col-reverse sm:flex-row justify-between gap-4 mb-8 text-center px-4 md:px-6"
    >
      <NuxtLink
        to="/themes/categories"
        class="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 font-medium text-white hover:scale-105 active:scale-95 transition duration-300"
      >
        Kelola Kategori
      </NuxtLink>

      <span
        class="py-2 px-4 h-fit rounded-full bg-sky-50 dark:bg-sky-950 border border-sky-500 text-sm text-sky-600 dark:text-sky-400 font-medium"
        >Jumlah Kategori :
        {{ categoriesPending ? "-" : categories.length }}</span
      >
    </div>

    <!-- Enhanced Category Filter Buttons with Arrows -->
    <div class="relative px-4 md:px-6 group">
      <!-- Left Arrow -->
      <button
        v-show="showLeftArrow"
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-900 shadow-xl rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-slate-200 dark:border-slate-700"
      >
        <i class="bi bi-chevron-left text-lg font-bold"></i>
      </button>

      <!-- Scrollable Container -->
      <div
        ref="scrollContainer"
        class="flex md:justify-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <!-- All Themes Button -->
        <button
          @click="activeCategory = 'all'"
          :class="[
            activeCategory === 'all'
              ? 'active-category bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 hover:text-slate-900 dark:hover:text-slate-50 shadow-lg',
          ]"
          :disabled="themesPending"
          class="group/btn relative px-5 py-2.5 border border-slate-200/10 hover:border-slate-200/20 dark:border-slate-800/10 dark:hover:border-slate-800/20 rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex-shrink-0"
        >
          <!-- Active Glow Effect -->
          <div
            v-if="activeCategory === 'all'"
            class="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-sky-500/20 blur-xl rounded-2xl"
          ></div>

          <span
            class="relative flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <i class="bi bi-grid-3x3-gap text-base"></i>
            Semua Tema
            <span
              :class="[
                'text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors',
                activeCategory === 'all'
                  ? 'bg-white/20'
                  : 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
              ]"
            >
              {{ getThemeCount("all") }}
            </span>
          </span>
        </button>

        <!-- Category Buttons -->
        <button
          v-for="category in categories"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="[
            activeCategory === category.id
              ? 'active-category bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 hover:text-slate-900 dark:hover:text-slate-50 shadow-lg',
          ]"
          :disabled="themesPending"
          class="group/btn relative px-5 py-2.5 border border-slate-200/10 hover:border-slate-200/20 dark:border-slate-800/10 dark:hover:border-slate-800/20 rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex-shrink-0"
        >
          <!-- Active Glow Effect -->
          <div
            v-if="activeCategory === category.id"
            class="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-sky-500/20 blur-xl rounded-2xl"
          ></div>

          <span
            class="relative flex items-center gap-2 text-sm whitespace-nowrap"
          >
            {{ category.name }}
            <span
              :class="[
                'text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors',
                activeCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
              ]"
            >
              {{ getThemeCount(category.id) }}
            </span>
          </span>
        </button>
      </div>

      <!-- Right Arrow -->
      <button
        v-show="showRightArrow"
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-900 shadow-xl rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-slate-200 dark:border-slate-700"
      >
        <i class="bi bi-chevron-right text-lg font-bold"></i>
      </button>

      <!-- Gradient Fade Effects -->
      <div
        v-show="showLeftArrow"
        class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <div
        v-show="showRightArrow"
        class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>

    <!-- Loading State -->
    <div
      v-if="themesPending"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <div class="relative mb-6">
        <div
          class="w-16 h-16 border-4 border-sky-200 dark:border-sky-900/30 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"
        ></div>
      </div>

      <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
        Memuat Tema...
      </h3>

      <p class="text-slate-600 dark:text-slate-300 text-center max-w-md">
        Mohon tunggu sebentar, kami sedang memuat daftar tema undangan untuk
        Anda.
      </p>
    </div>

    <!-- Themes Grid -->
    <div
      v-else-if="filteredThemes && filteredThemes.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6"
    >
      <ThemesCard
        v-for="theme in filteredThemes"
        :key="theme.id"
        :theme="theme"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4">
      <div class="relative mb-6">
        <div
          class="w-24 h-24 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/20 dark:to-sky-900/20 rounded-4xl flex items-center justify-center"
        >
          <i class="bi bi-palette2 text-4xl text-sky-500 dark:text-sky-400"></i>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
        Belum Ada Tema Tersedia
      </h3>

      <p
        class="text-slate-600 dark:text-slate-300 text-center max-w-md leading-relaxed"
      >
        Saat ini tidak ada tema yang tersedia untuk kategori
        <span class="font-medium text-sky-600 dark:text-sky-400">{{
          getCurrentCategoryName
        }}</span
        >. Silakan coba kategori lain atau kembali lagi nanti.
      </p>

      <button
        @click="activeCategory = 'all'"
        v-if="activeCategory !== 'all'"
        class="mt-6 px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
      >
        Lihat Semua Tema
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar completely */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
