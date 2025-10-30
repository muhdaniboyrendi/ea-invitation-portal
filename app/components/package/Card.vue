<script setup>
const { user } = storeToRefs(useAuthStore());
const { deletePackage, refresh } = usePackageStore();

const props = defineProps(["package"]);

const showAllFeatures = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

// Notification state
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

const confirmDelete = async () => {
  isDeleting.value = true;

  try {
    await deletePackage(props.package.id);

    closeDeleteModal();
    showNotification("success", "Paket berhasil dihapus! 🎉");

    setTimeout(() => {
      refresh();
    }, 3000);
  } catch (error) {
    console.error("Error deleting package:", error);
    closeDeleteModal();
    showNotification(
      "error",
      `Gagal menghapus paket. ${error.message || "Silakan coba lagi."}`
    );
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="group relative bg-gradient-to-b rounded-3xl w-full h-fit">
    <!-- Popup Alert Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="3000"
      @close="closeNotification"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Paket?"
      message="Apakah Anda yakin ingin menghapus paket"
      :item-name="props.package?.name"
      :is-deleting="isDeleting"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    >
      <div class="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
        <p class="text-sm text-center text-red-800 dark:text-red-200">
          <i class="bi bi-exclamation-circle-fill mr-1"></i>
          Data yang sudah dihapus tidak dapat dikembalikan.
        </p>
      </div>
    </ConfirmDeleteModal>

    <!-- Best Seller Badge -->
    <div
      v-if="props.package.id === 2"
      class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div
        class="bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"
      >
        BEST SELLER
      </div>
    </div>

    <div
      class="relative w-full h-full p-8 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl"
      :class="
        props.package.id === 2
          ? 'border-2 border-sky-500/80 bg-sky-50 dark:bg-slate-950'
          : 'border border-slate-200/10 dark:border-slate-800/10 bg-white dark:bg-slate-900'
      "
    >
      <!-- Package Header -->
      <div class="text-center mb-8">
        <h3
          class="text-2xl font-bold mb-8"
          :class="
            props.package.id === 2
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-600'
              : 'text-slate-900 dark:text-slate-50'
          "
        >
          {{ props.package.name }}
        </h3>

        <!-- Price -->
        <div class="relative">
          <div
            v-if="props.package?.discount"
            class="absolute -top-4 right-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {{ props.package.discount }}% OFF
          </div>
          <div class="flex items-baseline justify-center mb-2">
            <span
              class="font-bold text-transparent bg-clip-text bg-gradient-to-r"
              :class="
                props.package.id === 2
                  ? 'from-sky-500 to-sky-600 text-5xl'
                  : 'from-sky-500 to-sky-600 text-4xl'
              "
            >
              <span class="text-base">Rp</span>
              {{ formatRupiah(props.package.final_price) }}
            </span>
          </div>
          <div
            v-if="props.package?.discount"
            class="text-sm text-slate-600 dark:text-slate-300"
          >
            <span class="line-through"
              >Rp {{ formatRupiah(props.package.price) }}</span
            >
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="space-y-4 mb-6">
        <transition-group name="features" tag="div" class="space-y-4">
          <div
            v-for="(feature, index) in displayedFeatures"
            :key="`feature-${index}`"
            class="flex items-start gap-x-3"
          >
            <i
              class="bi bi-check2 text-xl"
              :class="props.package.id === 2 ? 'text-sky-500' : 'text-sky-500'"
            ></i>
            <span class="text-slate-900 dark:text-slate-50">{{ feature }}</span>
          </div>
        </transition-group>
      </div>

      <!-- Show More/Less Button -->
      <div v-if="hasHiddenFeatures" class="text-center mb-6">
        <button
          @click="toggleFeatures"
          class="inline-flex items-center gap-2 text-sm font-medium hover:underline transition-all duration-300"
          :class="
            props.package.id === 2
              ? 'text-sky-500 hover:text-sky-400'
              : 'text-sky-500 hover:text-sky-400'
          "
        >
          <span>{{
            showAllFeatures ? "Lihat lebih sedikit" : "Lihat lebih banyak"
          }}</span>
          <i
            class="bi transition-transform duration-300"
            :class="showAllFeatures ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </button>
      </div>

      <!-- CTA Buttons -->
      <div v-if="user.role === 'admin'" class="flex gap-6">
        <NuxtLink
          :to="`/packages/${props.package.id}`"
          class="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          :class="
            props.package.id === 2
              ? 'from-sky-500/80 to-sky-600/80 hover:from-sky-500 hover:to-sky-600'
              : 'from-sky-500/80 to-sky-600/80 hover:from-sky-500 hover:to-sky-600'
          "
        >
          <span class="relative z-10">Edit</span>
          <div
            class="absolute inset-0 bg-gradient-to-r blur-xl group-hover/btn:blur-2xl transition-all duration-300 rounded-xl"
            :class="
              props.package.id === 2
                ? 'from-sky-500/20 to-sky-600/20'
                : 'from-sky-500/20 to-sky-600/20'
            "
          ></div>
        </NuxtLink>
        <button
          v-if="
            props.package.id !== 1 &&
            props.package.id !== 2 &&
            props.package.id !== 3
          "
          @click="openDeleteModal"
          class="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <span class="relative z-10">Hapus</span>
          <div
            class="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 blur-xl group-hover/btn:blur-2xl transition-all duration-300 rounded-xl"
          ></div>
        </button>
      </div>
      <NuxtLink
        v-else
        :to="`/invitation/create/checkout/${props.package.id}`"
        class="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
        :class="
          props.package.id === 2
            ? 'from-sky-500/80 to-sky-600/80 hover:from-sky-500 hover:to-sky-600'
            : 'from-sky-500/80 to-sky-600/80 hover:from-sky-500 hover:to-sky-600'
        "
      >
        <span class="relative z-10">Pilih Paket</span>
        <i class="bi bi-arrow-right ml-2"></i>
        <div
          class="absolute inset-0 bg-gradient-to-r blur-xl group-hover/btn:blur-2xl transition-all duration-300 rounded-xl"
          :class="
            props.package.id === 2
              ? 'from-sky-500/20 to-sky-600/20'
              : 'from-sky-500/20 to-sky-600/20'
          "
        ></div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Transisi untuk features list */
.features-enter-active,
.features-leave-active {
  transition: all 0.3s ease;
}

.features-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.features-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.features-move {
  transition: transform 0.3s ease;
}
</style>
