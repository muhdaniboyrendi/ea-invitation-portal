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
    class="min-h-screen bg-off-white dark:bg-gray-900 rounded-3xl px-4 py-6 md:px-6 md:py-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header Section - Mobile Optimized -->
      <div class="mb-6 md:mb-8">
        <div class="text-center space-y-2 mb-6">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight"
          >
            Pilih Tema Undangan
          </h1>
          <p
            class="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto px-2"
          >
            Pilih tema favorit Anda dan ubah kapan saja
          </p>
        </div>

        <!-- Selected Theme Card - Compact Mobile View -->
        <div
          v-if="selectedTheme"
          class="bg-white dark:bg-dark rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <!-- Header with Icon -->
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md"
            >
              <i class="bi bi-check-circle-fill text-lg text-white"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h2
                class="font-semibold text-base md:text-lg text-gray-900 dark:text-white"
              >
                Tema Aktif
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ selectedTheme.name }}
              </p>
            </div>
          </div>

          <!-- Info Grid - Stack on Mobile -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Theme Name -->
            <div
              class="col-span-2 md:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/30"
            >
              <p
                class="text-[10px] md:text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide"
              >
                Nama Tema
              </p>
              <p
                class="font-semibold text-sm md:text-base text-gray-900 dark:text-white truncate"
              >
                {{ selectedTheme.name }}
              </p>
            </div>

            <!-- Category -->
            <div
              class="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-3 border border-purple-200/50 dark:border-purple-700/30"
            >
              <p
                class="text-[10px] md:text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wide"
              >
                Kategori
              </p>
              <p
                class="font-semibold text-sm md:text-base text-gray-900 dark:text-white truncate"
              >
                {{ getSelectedThemeCategory }}
              </p>
            </div>

            <!-- Status -->
            <div
              class="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/30"
            >
              <p
                class="text-[10px] md:text-xs font-medium text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wide"
              >
                Status
              </p>
              <span
                v-if="selectedTheme.is_premium"
                class="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[10px] md:text-xs font-bold rounded-lg shadow-sm"
              >
                <i class="bi bi-star-fill text-[10px]"></i>
                Premium
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 text-[10px] md:text-xs font-bold rounded-lg shadow-sm"
              >
                <i class="bi bi-check-circle-fill text-[10px]"></i>
                Basic
              </span>
            </div>
          </div>
        </div>

        <!-- No Theme Selected - Compact -->
        <div
          v-else
          class="bg-white dark:bg-dark rounded-2xl md:rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
        >
          <div
            class="w-12 h-12 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3"
          >
            <i class="bi bi-cursor text-xl md:text-2xl text-gray-400"></i>
          </div>
          <p
            class="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300"
          >
            Pilih tema untuk memulai
          </p>
        </div>
      </div>

      <!-- Category Filter - Horizontal Scroll on Mobile -->
      <div class="mb-6">
        <div class="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div
            class="flex md:flex-wrap md:justify-center gap-2 md:gap-3 min-w-max md:min-w-0"
          >
            <button
              @click="activeCategory = 'all'"
              :class="[
                'flex-shrink-0 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300',
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 active:scale-95',
              ]"
              :disabled="pending"
            >
              <span class="flex items-center gap-2">
                Semua
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    activeCategory === 'all'
                      ? 'bg-white/20'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                  ]"
                >
                  {{ getThemeCount("all") }}
                </span>
              </span>
            </button>

            <button
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              :class="[
                'flex-shrink-0 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300',
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 active:scale-95',
              ]"
              :disabled="pending"
            >
              <span class="flex items-center gap-2">
                {{ category.name }}
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    activeCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                  ]"
                >
                  {{ getThemeCount(category.id) }}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State - Minimal -->
      <div
        v-if="pending"
        class="flex flex-col items-center justify-center py-16 md:py-24"
      >
        <div
          class="w-12 h-12 md:w-16 md:h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"
        ></div>
        <p
          class="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400"
        >
          Memuat tema...
        </p>
      </div>

      <!-- Themes Grid - Responsive -->
      <div
        v-else-if="filteredThemes && filteredThemes.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        <UserInvitationSetupThemeCard
          v-for="theme in filteredThemes"
          :key="theme.id"
          :theme="theme"
          :is-selected="selectedTheme?.id === theme.id"
          @select-theme="handleThemeSelected"
        />
      </div>

      <!-- Empty State - Clean and Minimal -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-16 md:py-24 px-4"
      >
        <div
          class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl flex items-center justify-center mb-4"
        >
          <i
            class="bi bi-palette2 text-3xl md:text-4xl text-blue-600 dark:text-blue-400"
          ></i>
        </div>

        <h3
          class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center"
        >
          Belum Ada Tema
        </h3>

        <p
          class="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6"
        >
          Tidak ada tema untuk kategori
          <span class="font-semibold text-blue-600 dark:text-blue-400">{{
            getCurrentCategoryName
          }}</span>
        </p>

        <button
          @click="activeCategory = 'all'"
          v-if="activeCategory !== 'all'"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all duration-300"
        >
          Lihat Semua Tema
        </button>
      </div>
    </div>
  </div>
</template>
