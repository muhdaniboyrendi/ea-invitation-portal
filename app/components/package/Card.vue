<script setup>
const { user } = storeToRefs(useAuthStore());
const { deletePackage, refresh } = usePackageStore();

const props = defineProps(["package"]);
const emit = defineEmits(["deleted"]);

const showAllFeatures = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

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

    emit("deleted");

    await refresh();
  } catch (error) {
    console.error("Error deleting package:", error);
    // Optionally, show a user-friendly error message here
  } finally {
    closeDeleteModal();
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="group relative bg-gradient-to-b rounded-3xl w-full h-fit">
    <!-- Best Seller Badge -->
    <div
      v-if="props.package.id === 2"
      class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div
        class="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"
      >
        BEST SELLER
      </div>
    </div>

    <div
      class="relative w-full h-full p-8 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl"
      :class="
        props.package.id === 2
          ? 'border-2 border-purple-500/80 bg-purple-500/10 dark:bg-black'
          : 'border border-dark/10 dark:border-white/10 bg-white dark:bg-black'
      "
    >
      <!-- Package Header -->
      <div class="text-center mb-8">
        <h3
          class="text-2xl font-bold mb-8"
          :class="
            props.package.id === 2
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500'
              : 'text-dark/80 dark:text-white'
          "
        >
          {{ props.package.name }}
        </h3>

        <!-- Price -->
        <div class="relative">
          <div
            v-if="props.package?.discount"
            class="absolute -top-4 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {{ props.package.discount }}% OFF
          </div>
          <div class="flex items-baseline justify-center mb-2">
            <span
              class="font-bold text-transparent bg-clip-text bg-gradient-to-r"
              :class="
                props.package.id === 2
                  ? 'from-purple-500 to-pink-500 text-5xl'
                  : 'from-blue-500 to-cyan-500 text-4xl'
              "
            >
              <span class="text-base">Rp</span>
              {{ formatRupiah(props.package.final_price) }}
            </span>
          </div>
          <div
            v-if="props.package?.discount"
            class="text-sm text-black/50 dark:text-white/50"
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
              :class="
                props.package.id === 2 ? 'text-purple-500' : 'text-blue-500'
              "
            ></i>
            <span class="text-black/80 dark:text-white/80">{{ feature }}</span>
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
              ? 'text-purple-500 hover:text-purple-300'
              : 'text-blue-500 hover:text-blue-300'
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

      <div v-if="showDeleteModal" class="mt-6">
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-12 aspect-square bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center"
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
        </div>

        <!-- Modal Body -->
        <div class="py-6">
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
        <div class="flex gap-3">
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
            <span v-if="isDeleting" class="flex gap-1 items-center"
              ><Spinner /> Menghapus...</span
            >
            <span v-else>Hapus</span>
          </button>
        </div>
      </div>

      <div v-else>
        <!-- CTA Button -->
        <div v-if="user.role === 'admin'" class="flex gap-6">
          <NuxtLink
            :to="`/invitation/create/checkout/${props.package.id}`"
            class="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
            :class="
              props.package.id === 2
                ? 'from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500'
                : 'from-blue-500/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-500'
            "
          >
            <span class="relative z-10">Edit</span>
            <div
              class="absolute inset-0 bg-gradient-to-r blur-xl group-hover/btn:blur-2xl transition-all duration-300 rounded-xl"
              :class="
                props.package.id === 2
                  ? 'from-purple-500/20 to-pink-500/20'
                  : 'from-blue-500/20 to-cyan-500/20'
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
            class="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span class="relative z-10">Hapus</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-red-500/20 blur-xl group-hover/btn:blur-2xl transition-all duration-300 rounded-xl"
            ></div>
          </button>
        </div>
        <NuxtLink
          v-else
          :to="`/invitation/create/checkout/${props.package.id}`"
          class="w-full group/btn relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          :class="
            props.package.id === 2
              ? 'from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500'
              : 'from-blue-500/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-500'
          "
        >
          <span class="relative z-10">Pilih Paket</span>
          <i class="bi bi-arrow-right ml-2"></i>
          <div
            class="absolute inset-0 bg-gradient-to-r blur-xl group-hover/btn:blur-2xl transition-all duration-300 rounded-xl"
            :class="
              props.package.id === 2
                ? 'from-purple-500/20 to-pink-500/20'
                : 'from-blue-500/20 to-cyan-500/20'
            "
          ></div>
        </NuxtLink>
      </div>
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

/* Transisi untuk modal */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.9) translateY(-10px);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
