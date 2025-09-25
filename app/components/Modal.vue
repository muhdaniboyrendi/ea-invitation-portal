<script setup>
const { user } = storeToRefs(useAuthStore());

const props = defineProps(["package"]);
const emit = defineEmits(["delete"]);

const showAllFeatures = ref(false);
const showDeleteModal = ref(false);
const maxFeatures = 3;

const displayedFeatures = computed(() => {
  if (showAllFeatures.value || props.package.features.length <= maxFeatures) {
    return props.package.features;
  }
  return props.package.features.slice(0, maxFeatures);
});

const hasHiddenFeatures = computed(() => {
  return props.package.features.length > maxFeatures;
});

const toggleFeatures = () => {
  showAllFeatures.value = !showAllFeatures.value;
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const confirmDelete = () => {
  emit("delete", props.package.id);
  closeDeleteModal();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeDeleteModal"
        ></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4 transform"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
              >
                <i
                  class="bi bi-exclamation-triangle-fill text-red-600 dark:text-red-400 text-xl"
                ></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Konfirmasi Hapus
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>
            <button
              @click="closeDeleteModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              Apakah Anda yakin ingin menghapus paket
              <span class="font-semibold text-purple-600 dark:text-purple-400">
                "{{ props.package.name }}" </span
              >?
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Data yang sudah dihapus tidak dapat dikembalikan.
            </p>
          </div>

          <!-- Modal Footer -->
          <div class="flex gap-3 p-6 pt-0">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
