<script setup>
const { user } = storeToRefs(useAuthStore());
const { themes, themesPending } = storeToRefs(useThemeStore());
const { categories, categoriesPending } = storeToRefs(useThemeCategoryStore());

const activeCategory = ref("all");

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
  // Guard clause untuk themes yang undefined atau null
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
</script>

<template>
  <div class="grid gap-6">
    <Header
      title="Tema Undangan"
      subtitle="Daftar tema undangan yang tersedia untuk undangan anda."
      button-text="Tambah Tema"
      :has-button="user.role == 'admin' ? true : false"
      button-link="/themes/create"
      icon="bi-palette2"
    />

    <div
      class="relative p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
    >
      <div
        v-if="user.role == 'admin'"
        class="flex flex-col-reverse sm:flex-row justify-between gap-4 mb-8 text-center"
      >
        <NuxtLink
          to="/themes/categories"
          class="px-6 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 font-medium text-white hover:scale-105 active:scale-95 transition duration-300"
        >
          Kelola Kategori
        </NuxtLink>

        <span
          class="py-2 px-4 h-fit rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-500 text-sm text-blue-600 dark:text-blue-500 font-medium"
          >Jumlah Kategori :
          {{ categoriesPending ? "-" : categories.length }}</span
        >
      </div>

      <!-- Category Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-6">
        <button
          @click="activeCategory = 'all'"
          :class="
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : ' bg-white dark:bg-dark text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white shadow-lg'
          "
          :disabled="themesPending"
          class="group relative px-4 py-1.5 border border-white/10 hover:border-white/20 rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
        >
          <!-- Active Glow Effect -->
          <div
            v-if="activeCategory === 'all'"
            class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl rounded-2xl"
          ></div>

          <span class="relative flex items-center text-sm">
            Semua Tema
            <span class="ml-2 text-xs bg-white/10 px-2 py-1 rounded-full">
              {{ getThemeCount("all") }}
            </span>
          </span>
        </button>

        <button
          v-for="category in categories"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="
            activeCategory === category.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : ' bg-white dark:bg-dark text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white shadow-lg'
          "
          :disabled="themesPending"
          class="group relative px-4 py-1.5 border border-white/10 hover:border-white/20 rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
        >
          <!-- Active Glow Effect -->
          <div
            v-if="activeCategory === category.id"
            class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl rounded-2xl"
          ></div>

          <span class="relative flex items-center text-sm">
            {{ category.name }}
            <span class="ml-2 text-xs bg-white/10 px-2 py-1 rounded-full">
              {{ getThemeCount(category.id) }}
            </span>
          </span>
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="themesPending"
        class="flex flex-col items-center justify-center py-16 px-4"
      >
        <!-- Loading Spinner -->
        <div class="relative mb-6">
          <div
            class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"
          ></div>
        </div>

        <!-- Loading Text -->
        <h3 class="text-xl font-semibold text-dark dark:text-white mb-3">
          Memuat Tema...
        </h3>

        <p class="text-dark/60 dark:text-white/60 text-center max-w-md">
          Mohon tunggu sebentar, kami sedang memuat daftar tema undangan untuk
          Anda.
        </p>
      </div>

      <!-- Themes Grid -->
      <div
        v-else-if="filteredThemes && filteredThemes.length > 0"
        class="flex flex-wrap justify-center gap-8"
      >
        <ThemesCard
          v-for="theme in filteredThemes"
          :key="theme.id"
          :theme="theme"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-16 px-4">
        <!-- Empty Icon -->
        <div class="relative mb-6">
          <div
            class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-4xl flex items-center justify-center"
          >
            <i
              class="bi bi-palette2 text-4xl text-blue-500 dark:text-blue-400"
            ></i>
          </div>
        </div>

        <!-- Empty Message -->
        <h3 class="text-xl font-semibold text-dark dark:text-white mb-3">
          Belum Ada Tema Tersedia
        </h3>

        <p
          class="text-dark/60 dark:text-white/60 text-center max-w-md leading-relaxed"
        >
          Saat ini tidak ada tema yang tersedia untuk kategori
          <span class="font-medium text-blue-600 dark:text-blue-400">{{
            getCurrentCategoryName
          }}</span
          >. Silakan coba kategori lain atau kembali lagi nanti.
        </p>

        <!-- Action Button (Optional) -->
        <button
          @click="activeCategory = 'all'"
          v-if="activeCategory !== 'all'"
          class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Lihat Semua Tema
        </button>
      </div>
    </div>
  </div>
</template>
