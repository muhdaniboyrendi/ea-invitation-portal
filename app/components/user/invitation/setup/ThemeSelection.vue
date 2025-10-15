<script setup>
const { fetchThemesByOrderId } = useThemeStore();
const { categories, categoriesPending } = storeToRefs(useThemeCategoryStore());

const props = defineProps(["orderId"]);
const emit = defineEmits(["themeSelected"]);

const themes = ref([]);
const pending = ref(true);
const selectedTheme = ref(null);

const activeCategory = ref("all");

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

const getCurrentCategoryName = computed(() => {
  if (activeCategory.value === "all") {
    return "Semua Tema";
  }

  const categoryList =
    categories.value && categories.value.length > 0 ? categories.value : [];

  const category = categoryList.find((cat) => cat.id === activeCategory.value);
  return category ? category.name : "Kategori";
});

const getSelectedThemeCategory = computed(() => {
  if (!selectedTheme.value) return "-";

  const categoryList =
    categories.value && categories.value.length > 0 ? categories.value : [];

  const category = categoryList.find(
    (cat) => cat.id === selectedTheme.value.theme_category_id
  );
  return category ? category.name : "-";
});

const handleThemeSelected = (theme) => {
  selectedTheme.value = theme;

  emit("themeSelected", theme.id);
};

const loadThemes = async () => {
  pending.value = true;

  try {
    const response = await fetchThemesByOrderId(props.orderId);

    themes.value = response;

    // Auto-select first theme or previously selected theme
    if (response && response.length > 0 && !selectedTheme.value) {
      selectedTheme.value = response.find((t) => t.is_selected) || null;
    }
  } catch (error) {
    console.error(error);
    console.error(error.validationErrors);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadThemes();
});
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <!-- Header with Better Layout -->
    <div class="mb-10 p-4">
      <!-- Title Section -->
      <div class="text-center mb-6">
        <h3
          class="font-bold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3"
        >
          Pilih Tema Undangan
        </h3>
        <p
          class="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto"
        >
          Pilih tema yang sesuai dengan gaya undangan Anda. Tema dapat diubah
          kapan saja yang anda inginkan.
        </p>
      </div>

      <!-- Selected Theme Info Card -->
      <div
        v-if="selectedTheme"
        class="bg-white dark:bg-dark rounded-xl p-5 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md"
          >
            <i class="bi bi-check2-circle text-xl text-white"></i>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white text-lg">
              Tema Terpilih
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Tema yang sedang aktif untuk undangan Anda
            </p>
          </div>
        </div>

        <div v-if="selectedTheme" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Theme Name -->
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/30"
          >
            <p
              class="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide"
            >
              Nama Tema
            </p>
            <p
              class="font-semibold text-gray-900 dark:text-white text-base truncate"
            >
              {{ selectedTheme.name }}
            </p>
          </div>

          <!-- Category -->
          <div
            class="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/30"
          >
            <p
              class="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide"
            >
              Kategori
            </p>
            <p
              class="font-semibold text-gray-900 dark:text-white text-base truncate"
            >
              {{ getSelectedThemeCategory }}
            </p>
          </div>

          <!-- Premium Status -->
          <div
            class="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-4 border border-amber-200/50 dark:border-amber-700/30"
          >
            <p
              class="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wide"
            >
              Status
            </p>
            <div class="flex items-center gap-2">
              <span
                v-if="selectedTheme.is_premium"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold rounded-full shadow-sm"
              >
                <i class="bi bi-star-fill"></i>
                Premium
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 text-xs font-bold rounded-full shadow-sm"
              >
                <i class="bi bi-check-circle-fill"></i>
                Basic
              </span>
            </div>
          </div>
        </div>

        <!-- No Theme Selected State -->
        <div v-else class="text-center py-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-3"
          >
            <i
              class="bi bi-cursor text-2xl text-gray-400 dark:text-gray-500"
            ></i>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">
            Belum ada tema yang dipilih
          </p>
          <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Silakan pilih tema dari daftar di bawah
          </p>
        </div>
      </div>
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
        :disabled="pending"
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
        :disabled="pending"
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
      v-if="pending"
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
      <UserInvitationSetupThemeCard
        v-for="theme in filteredThemes"
        :key="theme.id"
        :theme="theme"
        :is-selected="selectedTheme?.id === theme.id"
        @select-theme="handleThemeSelected"
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
</template>
