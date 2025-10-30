<script setup>
const { categories, categoriesPending } = storeToRefs(useThemeCategoryStore());
const { user } = storeToRefs(useAuthStore());
const { categoriesRefresh } = useThemeCategoryStore();

// Form state
const showForm = ref(false);
const editingCategoryId = ref(null);
const editingCategoryData = ref(null);

// Delete modal state
const showDeleteModal = ref(false);
const deletingCategoryId = ref(null);
const deletingCategoryName = ref("");
const isDeleting = ref(false);

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

  // Scroll to form
  nextTick(() => {
    const formElement = document.querySelector('[data-scroll-target="form"]');
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};

// Handle form close
const handleFormClose = () => {
  showForm.value = false;
  editingCategoryId.value = null;
  editingCategoryData.value = null;
};

const handleDeleteCategory = (category) => {
  deletingCategoryId.value = category.id;
  deletingCategoryName.value = category.name || "Kategori ini";
  showDeleteModal.value = true;
};

const handleConfirmDelete = async () => {
  isDeleting.value = true;

  try {
    await deleteThemeCategory(deletingCategoryId.value);

    showNotification("success", "Kategori berhasil dihapus!");
    showDeleteModal.value = false;

    setTimeout(() => {
      categoriesRefresh();
    }, 5000);
  } catch (error) {
    console.error("Error deleting category:", error);

    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Gagal menghapus kategori. Silakan coba lagi.";
    showNotification("error", message);
  } finally {
    isDeleting.value = false;
  }
};

const handleDeleteModalClose = () => {
  if (!isDeleting.value) {
    showDeleteModal.value = false;
    deletingCategoryId.value = null;
    deletingCategoryName.value = "";
  }
};
</script>

<template>
  <div class="space-y-6">
    <FormAlertNotification
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <CategoriesHeader @add-category="handleAddCategory" />

    <CategoriesForm
      v-if="showForm"
      data-scroll-target="form"
      :category-id="editingCategoryId"
      :category-data="editingCategoryData"
      @close="handleFormClose"
    />

    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Kategori?"
      message="Apakah Anda yakin ingin menghapus kategori"
      :item-name="deletingCategoryName"
      :is-deleting="isDeleting"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="handleDeleteModalClose"
      @confirm="handleConfirmDelete"
    />

    <!-- Category Cards Container -->
    <div>
      <!-- Loading State -->
      <div
        v-if="categoriesPending"
        class="flex flex-col items-center justify-center py-16 px-4"
      >
        <div class="relative mb-6">
          <div
            class="w-16 h-16 border-4 border-sky-200 dark:border-sky-900/30 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"
          ></div>
        </div>
        <h3
          class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3"
        >
          Memuat Kategori...
        </h3>
        <p class="text-slate-600 dark:text-slate-300 text-center max-w-md">
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
            class="w-24 h-24 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/20 dark:to-sky-900/20 rounded-4xl flex items-center justify-center"
          >
            <i class="bi bi-inbox text-4xl text-sky-500 dark:text-sky-400"></i>
          </div>
        </div>
        <h3
          class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3"
        >
          Belum Ada Kategori
        </h3>
        <p class="text-slate-600 dark:text-slate-300 text-center max-w-md mb-6">
          Tidak ada kategori tema yang tersedia saat ini. Buat kategori baru
          untuk memulai.
        </p>
        <button
          @click="handleAddCategory"
          class="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i>
          Buat Kategori Pertama
        </button>
      </div>

      <!-- Categories List -->
      <div v-else class="space-y-4 px-4 md:px-6">
        <CategoriesCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @edit="handleEditCategory"
          @delete="handleDeleteCategory"
        />

        <!-- Summary -->
        <div
          class="mt-6 pt-6 border-t border-slate-200/10 dark:border-slate-800/10"
        >
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Menampilkan
            <span class="font-semibold text-slate-900 dark:text-slate-50">{{
              categories.length
            }}</span>
            kategori tema
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
