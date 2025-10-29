<script setup>
const authStore = useAuthStore();
const themeStore = useThemeStore();

const { user } = storeToRefs(authStore);
const { themesRefresh, deleteTheme } = themeStore;

const props = defineProps(["theme"]);

const showDeleteModal = ref(false);
const isDeleting = ref(false);

// Notification state - Updated for popup
const notification = reactive({
  show: false,
  type: "info",
  message: "",
});

const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
};

const closeNotification = () => {
  notification.show = false;
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const handleDeleteTheme = async () => {
  isDeleting.value = true;
  try {
    await deleteTheme(props.theme.id);

    closeDeleteModal();
    showNotification("success", "Tema berhasil dihapus! 🎉");

    setTimeout(() => {
      themesRefresh();
    }, 3000);
  } catch (error) {
    console.error("Error menghapus tema:", error);
    closeDeleteModal();

    showNotification(
      "error",
      `Gagal menghapus tema. ${error.message || "Silakan coba lagi."}`
    );
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="group relative w-full">
    <!-- Popup Alert Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="3000"
      @close="closeNotification"
    />

    <!-- Theme Card -->
    <div
      class="relative bg-white dark:bg-slate-900 border border-slate-200/10 hover:border-slate-200/20 dark:border-slate-800/10 dark:hover:border-slate-800/20 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-103 hover:shadow-2xl"
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
            class="w-full aspect-4/3 object-cover object-center rounded-xl border border-slate-200/10 dark:border-slate-800/10"
            loading="lazy"
            format="webp"
          />
          <div
            v-else
            class="w-full aspect-4/3 rounded-xl border border-slate-200/10 dark:border-slate-800/10 flex flex-col justify-center items-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600"
          >
            <i class="bi bi-image text-6xl"></i>
            <span class="text-sm font-medium">No Image</span>
          </div>
        </div>

        <!-- Theme Type Badge -->
        <div v-if="props.theme?.is_premium" class="absolute top-6 right-6 z-10">
          <span
            class="px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg"
          >
            Premium
          </span>
        </div>
      </div>

      <!-- Theme Info -->
      <div class="p-4 pt-0">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">
              {{ props.theme?.name || "Untitled Theme" }}
            </h3>
          </div>
          <span
            class="py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50"
          >
            {{ props.theme?.theme_category?.name || "Uncategorized" }}
          </span>
        </div>

        <a
          :href="props.theme?.link || '#'"
          target="_blank"
          :rel="props.theme?.name || 'null'"
          class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <span class="relative z-10">Lihat Tema</span>
          <i class="bi bi-arrow-right ml-2"></i>
        </a>

        <div v-if="user?.role === 'admin'" class="flex items-center gap-3 mt-4">
          <NuxtLink
            :to="`/themes/${props.theme.id}`"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >Edit
            <i class="bi bi-pencil-square ml-2"></i>
          </NuxtLink>
          <button
            type="button"
            @click="openDeleteModal"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Hapus
            <i class="bi bi-trash3 ml-2"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Tema?"
      message="Apakah Anda yakin ingin menghapus tema"
      :item-name="props.theme?.name"
      :is-deleting="isDeleting"
      type="danger"
      @close="closeDeleteModal"
      @confirm="handleDeleteTheme"
    >
      <p class="text-sm text-center text-slate-600 dark:text-slate-300 italic">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </ConfirmDeleteModal>
  </div>
</template>
