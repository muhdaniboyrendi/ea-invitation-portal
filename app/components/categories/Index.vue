<script setup>
const { categories, categoriesPending } = storeToRefs(useThemeCategoryStore());
const { user } = storeToRefs(useAuthStore());
const { createThemeCategory, updateThemeCategory } = useThemeCategoryStore();

// Form state
const showForm = ref(false);
const editingCategoryId = ref(null);
const editingCategoryData = ref(null);
const isSubmitting = ref(false);

// Notification state
const notification = reactive({
  show: false,
  type: "info",
  message: "",
});

// Show notification
const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
};

// Close notification
const closeNotification = () => {
  notification.show = false;
};

// Handle add category
const handleAddCategory = () => {
  showForm.value = true;
  editingCategoryId.value = null;
  editingCategoryData.value = null;
};

// Handle edit category
const handleEditCategory = (category) => {
  showForm.value = true;
  editingCategoryId.value = category.id;
  editingCategoryData.value = { ...category };
};

// Handle form close
const handleFormClose = () => {
  showForm.value = false;
  editingCategoryId.value = null;
  editingCategoryData.value = null;
};

// Handle form submit
const handleFormSubmit = async (submitData) => {
  isSubmitting.value = true;

  try {
    if (submitData.mode === "create") {
      // Create new category
      await createThemeCategory(submitData.data);
      showNotification("success", "Kategori berhasil ditambahkan!");
    } else {
      // Update existing category
      await updateThemeCategory(submitData.id, submitData.data);
      showNotification("success", "Kategori berhasil diperbarui!");
    }

    // Close form after success
    handleFormClose();
  } catch (error) {
    console.error("Error submitting category:", error);
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Terjadi kesalahan saat menyimpan kategori. Silakan coba lagi.";
    showNotification("error", message);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle delete category
const handleDeleteCategory = async (categoryId) => {
  if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
    try {
      // Call delete API from store
      // await deleteThemeCategory(categoryId);
      showNotification("success", "Kategori berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting category:", error);
      showNotification("error", "Gagal menghapus kategori. Silakan coba lagi.");
    }
  }
};
</script>

<template>
  <div class="grid gap-6">
    <!-- Alert Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="notification.show"
        class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 p-4 rounded-xl shadow-lg transition-all duration-300"
        :class="{
          'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700/30':
            notification.type === 'success',
          'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700/30':
            notification.type === 'error',
          'bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-700/30':
            notification.type === 'warning',
          'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700/30':
            notification.type === 'info',
        }"
      >
        <div class="flex items-start gap-3">
          <i
            class="text-xl mt-0.5"
            :class="{
              'bi bi-check-circle text-green-600 dark:text-green-400':
                notification.type === 'success',
              'bi bi-exclamation-circle text-red-600 dark:text-red-400':
                notification.type === 'error',
              'bi bi-exclamation-triangle text-yellow-600 dark:text-yellow-400':
                notification.type === 'warning',
              'bi bi-info-circle text-blue-600 dark:text-blue-400':
                notification.type === 'info',
            }"
          ></i>
          <div class="flex-1">
            <p
              class="text-sm font-semibold"
              :class="{
                'text-green-900 dark:text-green-100':
                  notification.type === 'success',
                'text-red-900 dark:text-red-100': notification.type === 'error',
                'text-yellow-900 dark:text-yellow-100':
                  notification.type === 'warning',
                'text-blue-900 dark:text-blue-100':
                  notification.type === 'info',
              }"
            >
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="closeNotification"
            class="text-dark/60 dark:text-white/60 hover:text-dark dark:hover:text-white transition-colors"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Header -->
    <CategoriesHeader @add-category="handleAddCategory" />

    <!-- Add/Edit Form -->
    <CategoriesForm
      v-if="showForm"
      :category-id="editingCategoryId"
      :category-data="editingCategoryData"
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />

    <!-- Category Cards Container -->
    <div
      class="relative p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
    >
      <!-- Loading State -->
      <div
        v-if="categoriesPending"
        class="flex flex-col items-center justify-center py-16 px-4"
      >
        <div class="relative mb-6">
          <div
            class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"
          ></div>
        </div>
        <h3 class="text-xl font-semibold text-dark dark:text-white mb-3">
          Memuat Kategori...
        </h3>
        <p class="text-dark/60 dark:text-white/60 text-center max-w-md">
          Mohon tunggu sebentar, kami sedang memuat daftar kategori tema.
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="categories.length === 0"
        class="flex flex-col items-center justify-center py-16 px-4"
      >
        <div class="relative mb-6">
          <div
            class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-4xl flex items-center justify-center"
          >
            <i
              class="bi bi-inbox text-4xl text-blue-500 dark:text-blue-400"
            ></i>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-dark dark:text-white mb-3">
          Belum Ada Kategori
        </h3>
        <p class="text-dark/60 dark:text-white/60 text-center max-w-md mb-6">
          Tidak ada kategori tema yang tersedia saat ini. Buat kategori baru
          untuk memulai.
        </p>
        <button
          @click="handleAddCategory"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i>
          Buat Kategori Pertama
        </button>
      </div>

      <!-- Categories List -->
      <div v-else class="space-y-4">
        <CategoriesCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @edit="handleEditCategory"
          @delete="handleDeleteCategory"
        />

        <!-- Summary -->
        <div class="mt-6 pt-6 border-t border-dark/10 dark:border-white/10">
          <p class="text-sm text-dark/60 dark:text-white/60">
            Menampilkan
            <span class="font-semibold text-dark dark:text-white">{{
              categories.length
            }}</span>
            kategori tema
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
