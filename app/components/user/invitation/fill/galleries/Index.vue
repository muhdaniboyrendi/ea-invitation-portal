<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchGalleries, createGalleries, deleteGallery } = useGalleryStore();

const galleries = ref([]);
const ui = reactive({
  isLoading: true,
  showForm: false,
});

const deleteModal = reactive({
  show: false,
  isDeleting: false,
  galleryId: null,
  galleryImage: "",
});

const lightbox = reactive({
  show: false,
  currentIndex: 0,
});

// Dynamic MAX_IMAGES based on packageId
const MAX_IMAGES = computed(() => {
  const pkgId = Number(props.packageId);
  if (pkgId === 1) return 4;
  if (pkgId === 2) return 10;
  if (pkgId === 3) return 50;
  if (pkgId > 3) return Infinity;
  return 10;
});

const hasImageLimit = computed(() => {
  return MAX_IMAGES.value !== Infinity;
});

const maxImagesText = computed(() => {
  return hasImageLimit.value ? MAX_IMAGES.value : "Tidak Terbatas";
});

// API Calls
const fetchData = async () => {
  ui.isLoading = true;
  try {
    const response = await fetchGalleries(props.invitationId);
    galleries.value = response || [];
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
  } finally {
    ui.isLoading = false;
  }
};

const refreshData = async () => {
  try {
    const response = await fetchGalleries(props.invitationId);
    galleries.value = response || [];
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
  }
};

// Form Handlers
const handleUploadSuccess = async (count) => {
  try {
    await refreshData();
    emit("success", `${count} foto berhasil ditambahkan ke galeri!`);
    ui.showForm = false;
  } catch (error) {
    console.error("Error refreshing data:", error);
    emit(
      "error",
      "Foto berhasil diupload, tapi gagal refresh galeri. Silakan refresh halaman."
    );
  }
};

const handleUploadError = (message) => {
  emit("error", message);
};

const toggleForm = () => {
  ui.showForm = !ui.showForm;
};

// Delete Modal Handlers
const openDeleteModal = (gallery) => {
  deleteModal.galleryId = gallery.id;
  deleteModal.galleryImage = gallery.image_url;
  deleteModal.show = true;
};

const closeDeleteModal = () => {
  deleteModal.show = false;
  deleteModal.galleryId = null;
  deleteModal.galleryImage = "";
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteGallery(deleteModal.galleryId);
    emit("success", "Foto berhasil dihapus dari galeri!");
    fetchData();
  } catch (error) {
    const message = error?.message || "Gagal menghapus foto.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
    closeDeleteModal();
  }
};

// Lightbox Handlers
const openLightbox = (index) => {
  lightbox.currentIndex = index;
  lightbox.show = true;
};

const closeLightbox = () => {
  lightbox.show = false;
};

const nextImage = () => {
  if (lightbox.currentIndex < galleries.value.length - 1) {
    lightbox.currentIndex++;
  } else {
    lightbox.currentIndex = 0;
  }
};

const prevImage = () => {
  if (lightbox.currentIndex > 0) {
    lightbox.currentIndex--;
  } else {
    lightbox.currentIndex = galleries.value.length - 1;
  }
};

const handleNext = () => {
  emit("next");
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Loading State -->
  <UserInvitationFillGalleriesPhotoGalleryLoading v-if="ui.isLoading" />

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Gallery Header -->
    <UserInvitationFillGalleriesPhotoGalleryHeader
      :photo-count="galleries.length"
      :max-images="MAX_IMAGES"
      :has-image-limit="hasImageLimit"
    />

    <!-- Gallery Grid -->
    <UserInvitationFillGalleriesPhotoGrid
      v-if="galleries.length > 0"
      :galleries="galleries"
      @view="openLightbox"
      @delete="openDeleteModal"
    />

    <!-- Empty State -->
    <UserInvitationFillGalleriesPhotoEmptyState v-else />

    <!-- Toggle Form Button -->
    <button
      @click="toggleForm"
      class="w-full h-12 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      :class="
        ui.showForm
          ? 'bg-slate-500 hover:bg-slate-600 text-white shadow-slate-500/25'
          : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25'
      "
    >
      <i :class="ui.showForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
      {{ ui.showForm ? "Batal" : "Tambah Foto" }}
    </button>

    <!-- Upload Form -->
    <UserInvitationFillGalleriesPhotoUploadForm
      v-if="ui.showForm"
      :invitation-id="invitationId"
      :max-images="MAX_IMAGES"
      :max-images-text="maxImagesText"
      :has-image-limit="hasImageLimit"
      @success="handleUploadSuccess"
      @error="handleUploadError"
      @cancel="toggleForm"
    />

    <!-- Next Button -->
    <div class="pt-2">
      <button
        @click="handleNext"
        class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Lanjutkan
        <i class="bi bi-arrow-right"></i>
      </button>
      <p class="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
        Galeri foto bersifat opsional, Anda bisa melewatinya
      </p>
    </div>

    <!-- Lightbox Modal -->
    <UserInvitationFillGalleriesPhotoLightboxModal
      v-if="lightbox.show"
      :galleries="galleries"
      :current-index="lightbox.currentIndex"
      @close="closeLightbox"
      @next="nextImage"
      @prev="prevImage"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="deleteModal.show"
      :is-deleting="deleteModal.isDeleting"
      title="Hapus Foto?"
      message="Apakah Anda yakin ingin menghapus foto ini dari galeri?"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    >
      <template #preview>
        <img
          v-if="deleteModal.galleryImage"
          :src="deleteModal.galleryImage"
          alt="Preview"
          class="w-full h-48 object-cover rounded-2xl mt-4"
        />
      </template>
    </ConfirmDeleteModal>
  </div>
</template>
