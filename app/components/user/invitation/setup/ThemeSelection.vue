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
};

const handleNext = () => {
  if (selectedTheme.value) {
    emit("themeSelected", selectedTheme.value);
  }
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
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section - Mobile Optimized -->
      <div class="mb-6 md:mb-8">
        <div class="text-center space-y-2 mb-6">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 dark:from-sky-400 dark:via-blue-400 dark:to-sky-500 bg-clip-text text-transparent leading-tight"
          >
            Pilih Tema Undangan
          </h1>
          <p
            class="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto px-2"
          >
            Pilih tema favorit Anda dan ubah kapan saja
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
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-500 dark:to-sky-600 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 active:scale-95',
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
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
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
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-500 dark:to-sky-600 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 active:scale-95',
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
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
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
          class="w-12 h-12 md:w-16 md:h-16 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin mb-4"
        ></div>
        <p
          class="text-sm md:text-base font-medium text-slate-600 dark:text-slate-300"
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
          class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-950 dark:to-blue-950 rounded-3xl flex items-center justify-center mb-4"
        >
          <i
            class="bi bi-palette2 text-3xl md:text-4xl text-sky-600 dark:text-sky-400"
          ></i>
        </div>

        <h3
          class="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2 text-center"
        >
          Belum Ada Tema
        </h3>

        <p
          class="text-sm md:text-base text-slate-600 dark:text-slate-300 text-center max-w-sm mb-6"
        >
          Tidak ada tema untuk kategori
          <span class="font-semibold text-sky-600 dark:text-sky-400">{{
            getCurrentCategoryName
          }}</span>
        </p>

        <button
          @click="activeCategory = 'all'"
          v-if="activeCategory !== 'all'"
          class="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 dark:hover:from-sky-400 dark:hover:to-sky-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-sky-500/25 active:scale-95 transition-all duration-300"
        >
          Lihat Semua Tema
        </button>
      </div>

      <button
        @click="handleNext"
        :disabled="!selectedTheme"
        class="w-full py-3 px-6 mt-8 rounded-2xl font-semibold transition-all duration-300"
        :class="
          selectedTheme
            ? 'bg-sky-500 hover:bg-sky-600 dark:hover:bg-sky-400 text-white cursor-pointer hover:shadow-lg'
            : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60'
        "
      >
        Selanjutnya
      </button>
    </div>
  </div>
</template>
