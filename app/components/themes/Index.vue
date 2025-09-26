<script setup>
const { categories, themes } = storeToRefs(useThemeStore());

const activeCategory = ref("all");

// Categories
const categoriesFake = ref([
  {
    id: "business",
    name: "Business",
  },
  {
    id: "portfolio",
    name: "Portfolio",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
  },
  {
    id: "blog",
    name: "Blog",
  },
  {
    id: "landing",
    name: "Landing Page",
  },
]);

// Sample themes data
const themesFake = ref([
  {
    id: 1,
    name: "NeonCorp",
    theme_category_id: "business",
    is_premium: 0,
  },
  {
    id: 2,
    name: "GlowFolio",
    theme_category_id: "portfolio",
    is_premium: 0,
  },
  {
    id: 3,
    name: "CyberShop",
    theme_category_id: "ecommerce",
    is_premium: 0,
  },
  {
    id: 4,
    name: "GlowBlog",
    theme_category_id: "blog",
    is_premium: 1,
  },
  {
    id: 5,
    name: "NeonLand",
    theme_category_id: "landing",
    is_premium: 0,
  },
  {
    id: 6,
    name: "TechStart",
    theme_category_id: "business",
    is_premium: 0,
  },
  {
    id: 7,
    name: "ArtistSpace",
    theme_category_id: "portfolio",
    is_premium: 0,
  },
  {
    id: 8,
    name: "LuxeStore",
    theme_category_id: "ecommerce",
    is_premium: 0,
  },
]);

// Computed filtered themes
const filteredThemes = computed(() => {
  if (themes.value) {
    if (activeCategory.value === "all") {
      return themes.value;
    }
    return themes.value.filter(
      (theme) => theme.theme_category_id === activeCategory.value
    );
  } else {
    if (activeCategory.value === "all") {
      return themesFake.value;
    }
    return themesFake.value.filter(
      (theme) => theme.theme_category_id === activeCategory.value
    );
  }
});

// Get theme count for category
const getThemeCount = (categoryId) => {
  if (categories.value) {
    if (categoryId === "all") {
      return themes.value.length;
    }
    return themes.value.filter(
      (theme) => theme.theme_category_id === categoryId
    ).length;
  } else {
    if (categoryId === "all") {
      return themesFake.value.length;
    }
    return themesFake.value.filter(
      (theme) => theme.theme_category_id === categoryId
    ).length;
  }
};

// Get current category name for empty state
const getCurrentCategoryName = computed(() => {
  if (activeCategory.value === "all") {
    return "Semua Tema";
  }

  const categoryList = categories.value || categoriesFake.value;
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
      button-link="/themes/create"
    />

    <div
      class="relative p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
    >
      <!-- Category Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-6">
        <button
          @click="activeCategory = 'all'"
          :class="
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : ' bg-white dark:bg-dark text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white shadow-lg'
          "
          class="group relative px-4 py-1.5 border border-white/10 hover:border-white/20 rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105"
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
          v-for="category in categories ? categories : categoriesFake"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="
            activeCategory === category.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : ' bg-white dark:bg-dark text-dark/70 dark:text-white/70 hover:text-dark dark:hover:text-white shadow-lg'
          "
          class="group relative px-4 py-1.5 border border-white/10 hover:border-white/20 rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105"
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

      <!-- Themes Grid -->
      <div
        v-if="filteredThemes && filteredThemes.length > 0"
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
            <svg
              class="w-12 h-12 text-blue-500 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
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
