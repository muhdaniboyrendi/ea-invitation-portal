<script setup>
const authStore = useAuthStore();
const themeStore = useThemeStore();

const { user } = storeToRefs(authStore);
const { themesRefresh, deleteTheme } = themeStore;

const props = defineProps(["theme"]);

const showDeleteModal = ref(false);
const isDeleting = ref(false);

const showAlert = ref(false);
const alertType = ref("success"); // 'success' atau 'error'
const alertMessage = ref("");

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const showNotification = (type, message) => {
  alertType.value = type;
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

const closeAlert = () => {
  showAlert.value = false;
};

const handleDeleteTheme = async () => {
  isDeleting.value = true;
  try {
    await deleteTheme(props.theme.id);

    closeDeleteModal();
    showNotification("success", "Tema berhasil dihapus!");

    setTimeout(() => {
      themesRefresh();
    }, 5000);
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
  <div class="group relative w-full max-w-70">
    <!-- Theme Card -->
    <div
      class="relative bg-white dark:bg-dark border border-white/10 hover:border-white/20 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <!-- Theme Preview Image -->
      <div class="relative h-fit overflow-hidden">
        <div class="p-4">
          <NuxtImg
            v-if="props.theme?.thumbnail_url"
            :src="props.theme?.thumbnail_url || '/img/hero.jpg'"
            :alt="props.theme?.name || 'Theme Image'"
            class="w-full aspect-4/3 object-cover object-center rounded-xl border border-white/10"
            loading="lazy"
            format="webp"
          />
          <div
            v-else
            class="w-full aspect-4/3 rounded-xl border border-white/10 flex flex-col justify-center items-center bg-zinc-400 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600"
          >
            <i class="bi bi-image text-6xl"></i>
            <span class="text-sm font-medium">No Image</span>
          </div>
        </div>

        <!-- Theme Type Badge -->
        <div v-if="props.theme?.is_premium" class="absolute top-6 right-6 z-10">
          <span
            class="px-3 py-1 rounded-full text-xs text-white font-semibold bg-blue-400"
          >
            Premium
          </span>
        </div>
      </div>

      <!-- Theme Info -->
      <div class="p-4 pt-0">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-dark dark:text-white">
              {{ props.theme?.name || "Untitled Theme" }}
            </h3>
          </div>
          <span
            class="py-1 px-2 rounded-lg bg-black/15 dark:bg-white/10 text-sm text-black/80 dark:text-white/80"
          >
            {{ props.theme?.theme_category?.name || "Uncategorized" }}
          </span>
        </div>

        <a
          :href="props.theme?.link || '#'"
          target="_blank"
          :rel="props.theme?.name || 'null'"
          class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <span class="relative z-10">Lihat Tema</span>
          <i class="bi bi-arrow-right ml-2"></i>
        </a>

        <div v-if="user.role === 'admin'" class="flex items-center gap-3 mt-4">
          <NuxtLink
            :to="`/themes/${props.theme.id}`"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >Edit
            <i class="bi bi-pencil-square ml-2"></i>
          </NuxtLink>
          <button
            type="button"
            @click="openDeleteModal"
            class="group/btn relative w-full inline-flex justify-center items-center px-4 py-2 backdrop-blur-md bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Hapus
            <i class="bi bi-trash3 ml-2"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="closeDeleteModal"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showDeleteModal"
              class="relative bg-white dark:bg-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6"
            >
              <!-- Icon Warning -->
              <div class="flex justify-center mb-4">
                <div
                  class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                >
                  <i
                    class="bi bi-exclamation-triangle text-3xl text-red-600 dark:text-red-400"
                  ></i>
                </div>
              </div>

              <!-- Judul Modal -->
              <h3
                class="text-xl font-bold text-center text-dark dark:text-white mb-2"
              >
                Hapus Tema?
              </h3>

              <!-- Deskripsi -->
              <p class="text-center text-black/70 dark:text-white/70 mb-6">
                Apakah Anda yakin ingin menghapus tema
                <span class="font-semibold text-dark dark:text-white">{{
                  props.theme?.name
                }}</span
                >? Tindakan ini tidak dapat dibatalkan.
              </p>

              <!-- Tombol Aksi -->
              <div class="flex gap-3">
                <button
                  type="button"
                  @click="closeDeleteModal"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-2.5 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-dark dark:text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="button"
                  @click="handleDeleteTheme"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-red-300 disabled:to-rose-300 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  <span v-if="!isDeleting">Hapus</span>
                  <span v-else class="flex items-center">
                    <svg
                      class="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menghapus...
                  </span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Alert Notification -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-[-100%]"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-[-100%]"
      >
        <div
          v-if="showAlert"
          class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4"
        >
          <div
            :class="[
              'relative backdrop-blur-sm rounded-2xl shadow-2xl p-4 border overflow-hidden',
              alertType === 'success'
                ? 'bg-green-500 border-green-400/50'
                : 'bg-red-500 border-red-400/50',
            ]"
          >
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    alertType === 'success' ? 'bg-white/20' : 'bg-white/20',
                  ]"
                >
                  <i
                    :class="[
                      'text-xl text-white',
                      alertType === 'success'
                        ? 'bi bi-check-circle-fill'
                        : 'bi bi-x-circle-fill',
                    ]"
                  ></i>
                </div>
              </div>

              <!-- Message -->
              <div class="flex-1 pt-1">
                <h4 class="text-white font-bold mb-1">
                  {{ alertType === "success" ? "Berhasil!" : "Gagal!" }}
                </h4>
                <p class="text-white/90 text-sm">
                  {{ alertMessage }}
                </p>
              </div>

              <!-- Close Button -->
              <button
                @click="closeAlert"
                class="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <i class="bi bi-x-lg text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
