<script setup>
const { fetchInvitation, updateTheme } = useInvitationStore();
const { fetchThemesByInvitationId } = useThemeStore();
const { categories, categoriesPending } = storeToRefs(useThemeCategoryStore());

const route = useRoute();

const invitationId = route.params.id;

const pending = ref(true);
const isLoading = ref(false);
const themes = ref([]);
const selectedTheme = ref(null);
const currentTheme = ref(null);
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

const handleThemeChangeConfirmation = async () => {
  isLoading.value = true;

  try {
    await updateTheme(invitationId, selectedTheme.value.id);
  } catch (error) {
    console.error("Error updating theme :", error);
    console.error("Error updating theme :", error.validationErrors);
  } finally {
    isLoading.value = false;
  }
};

const loadAllData = async () => {
  pending.value = true;

  try {
    const responseInvitation = await fetchInvitation(invitationId);
    currentTheme.value = responseInvitation.theme;

    const responseThemes = await fetchThemesByInvitationId(invitationId);
    themes.value = responseThemes;
    handleThemeSelected(responseInvitation.theme);
  } catch (error) {
    console.error(error);
    console.error(error.validationErrors);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div>
    <!-- Header with Better Layout -->
    <div class="mb-10 px-4 md:px-6">
      <!-- Selected Theme Info Card -->
      <div
        v-if="selectedTheme"
        class="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="flex items-center justify-center w-10 h-10 bg-sky-500 rounded-xl shadow-sm"
          >
            <i class="bi bi-check2-circle text-xl text-white"></i>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 dark:text-slate-50 text-lg">
              Tema Saat Ini
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              Tema yang sedang aktif untuk undangan Anda
            </p>
          </div>
        </div>

        <div v-if="selectedTheme" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Theme Name -->
          <div
            class="bg-sky-50 dark:bg-sky-950 rounded-xl p-4 border border-sky-200 dark:border-sky-800"
          >
            <p
              class="text-xs font-medium text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide"
            >
              Nama Tema
            </p>
            <p
              class="font-semibold text-slate-900 dark:text-slate-50 text-base truncate"
            >
              {{ selectedTheme.name }}
            </p>
          </div>

          <!-- Category -->
          <div
            class="bg-sky-50 dark:bg-sky-950 rounded-xl p-4 border border-sky-200 dark:border-sky-800"
          >
            <p
              class="text-xs font-medium text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide"
            >
              Kategori
            </p>
            <p
              class="font-semibold text-slate-900 dark:text-slate-50 text-base truncate"
            >
              {{ getSelectedThemeCategory }}
            </p>
          </div>

          <!-- Premium Status -->
          <div
            class="bg-sky-50 dark:bg-sky-950 rounded-xl p-4 border border-sky-200 dark:border-sky-800"
          >
            <p
              class="text-xs font-medium text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide"
            >
              Status
            </p>
            <div class="flex items-center gap-2">
              <span
                v-if="selectedTheme.is_premium"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm"
              >
                <i class="bi bi-star-fill"></i>
                Premium
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm"
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
            class="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-3"
          >
            <i
              class="bi bi-cursor text-2xl text-slate-400 dark:text-slate-500"
            ></i>
          </div>
          <p class="text-slate-600 dark:text-slate-300 font-medium">
            Belum ada tema yang dipilih
          </p>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Silakan pilih tema dari daftar di bawah
          </p>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-center mb-10 px-4 md:px-6">
      <button
        v-if="!pending"
        @click="handleThemeChangeConfirmation"
        type="button"
        :disabled="isLoading || currentTheme.id == selectedTheme.id"
        :class="[
          'py-4 px-8 rounded-2xl text-white text-base font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg',
          isLoading || currentTheme.id == selectedTheme.id
            ? 'cursor-not-allowed bg-slate-400 dark:bg-slate-600 opacity-70'
            : 'cursor-pointer bg-sky-500 hover:bg-sky-600 hover:scale-105 active:scale-95 shadow-sky-500/25',
        ]"
      >
        <Spinner v-if="isLoading" />
        <i v-else class="bi bi-check-circle-fill text-lg"></i>
        <span>{{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}</span>
      </button>
    </div>

    <!-- Category Filter Buttons -->
    <div class="flex flex-wrap justify-center gap-3 mb-8 px-4 md:px-6">
      <button
        @click="activeCategory = 'all'"
        :class="
          activeCategory === 'all'
            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border-sky-600'
            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 shadow-sm border-slate-200 dark:border-slate-800'
        "
        :disabled="pending"
        class="group relative px-4 py-2.5 border rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
      >
        <span class="relative flex items-center text-sm">
          Semua Tema
          <span
            :class="
              activeCategory === 'all'
                ? 'bg-white/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            "
            class="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold"
          >
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
            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border-sky-600'
            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 shadow-sm border-slate-200 dark:border-slate-800'
        "
        :disabled="pending"
        class="group relative px-4 py-2.5 border rounded-xl font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
      >
        <span class="relative flex items-center text-sm">
          {{ category.name }}
          <span
            :class="
              activeCategory === category.id
                ? 'bg-white/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            "
            class="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold"
          >
            {{ getThemeCount(category.id) }}
          </span>
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex flex-col items-center justify-center py-16 px-4 md:px-6"
    >
      <!-- Loading Spinner -->
      <div class="relative mb-6">
        <div
          class="w-16 h-16 border-4 border-sky-200 dark:border-sky-900 border-t-sky-500 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Loading Text -->
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
      <UserInvitationSetupThemeCard
        v-for="theme in filteredThemes"
        :key="theme.id"
        :theme="theme"
        :is-selected="selectedTheme?.id === theme.id"
        @select-theme="handleThemeSelected"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 px-4 md:px-6"
    >
      <!-- Empty Icon -->
      <div class="relative mb-6">
        <div
          class="w-24 h-24 bg-sky-50 dark:bg-sky-950 rounded-3xl flex items-center justify-center border border-sky-200 dark:border-sky-800"
        >
          <i class="bi bi-palette2 text-4xl text-sky-500"></i>
        </div>
      </div>

      <!-- Empty Message -->
      <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
        Belum Ada Tema Tersedia
      </h3>

      <p
        class="text-slate-600 dark:text-slate-300 text-center max-w-md leading-relaxed"
      >
        Saat ini tidak ada tema yang tersedia untuk kategori
        <span class="font-medium text-sky-500">{{
          getCurrentCategoryName
        }}</span
        >. Silakan coba kategori lain atau kembali lagi nanti.
      </p>

      <!-- Action Button (Optional) -->
      <button
        @click="activeCategory = 'all'"
        v-if="activeCategory !== 'all'"
        class="mt-6 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
      >
        Lihat Semua Tema
      </button>
    </div>
  </div>
</template>
