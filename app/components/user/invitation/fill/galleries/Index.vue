<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchGalleries, createGalleries, deleteGallery } = useGalleryStore();

// Reactive form data object
const formData = reactive({
  invitation_id: props.invitationId,
  images: [],
});

const ui = reactive({
  isLoading: true,
  isSubmitting: false,
  showForm: false,
});

// Multiple Images Upload State
const imageUpload = reactive({
  previews: [],
  files: [],
  errors: [],
  isDragging: false,
});

// Delete Modal State
const deleteModal = reactive({
  show: false,
  isDeleting: false,
  galleryId: null,
  galleryImage: "",
});

const galleries = ref([]);

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

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Computed Properties
const isFormValid = computed(() => {
  const hasFiles = imageUpload.files.length > 0;
  const withinLimit = hasImageLimit.value
    ? imageUpload.files.length <= MAX_IMAGES.value
    : true;
  const noErrors = imageUpload.errors.length === 0;

  return hasFiles && withinLimit && noErrors;
});

const remainingSlots = computed(() => {
  if (!hasImageLimit.value) return Infinity;
  return MAX_IMAGES.value - imageUpload.files.length;
});

const remainingSlotsText = computed(() => {
  if (!hasImageLimit.value) return "Tidak Terbatas";
  return `${remainingSlots.value} slot tersisa`;
});

const canAddMoreImages = computed(() => {
  if (!hasImageLimit.value) return true;
  return imageUpload.files.length < MAX_IMAGES.value;
});

// Image Upload Handlers
const validateImage = (file) => {
  const errors = [];

  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push(`${file.name}: Format tidak didukung (hanya JPG, PNG, WEBP)`);
  }

  if (file.size > MAX_SIZE) {
    errors.push(`${file.name}: Ukuran file terlalu besar (maksimal 2MB)`);
  }

  return errors;
};

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
};

const handleDrop = (event) => {
  imageUpload.isDragging = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = (files) => {
  imageUpload.errors = [];

  const totalCount = imageUpload.files.length + files.length;

  if (hasImageLimit.value && totalCount > MAX_IMAGES.value) {
    imageUpload.errors.push(
      `Maksimal ${MAX_IMAGES.value} foto. Anda sudah memiliki ${imageUpload.files.length} foto.`
    );
    return;
  }

  files.forEach((file) => {
    const errors = validateImage(file);

    if (errors.length > 0) {
      imageUpload.errors.push(...errors);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUpload.previews.push({
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
      imageUpload.files.push(file);
    }
  });

  if (imageUpload.errors.length > 0) {
    emit("error", imageUpload.errors.join("; "));
  }
};

const removeImage = (index) => {
  imageUpload.previews.splice(index, 1);
  imageUpload.files.splice(index, 1);
  imageUpload.errors = [];
};

const clearAllImages = () => {
  imageUpload.previews = [];
  imageUpload.files = [];
  imageUpload.errors = [];
};

const handleDragOver = (event) => {
  imageUpload.isDragging = true;
};

const handleDragLeave = (event) => {
  imageUpload.isDragging = false;
};

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

const submitForm = async () => {
  if (!isFormValid.value) {
    const limitText = hasImageLimit.value
      ? `maksimal ${MAX_IMAGES.value} foto`
      : "foto";
    emit("error", `Mohon pilih minimal 1 foto (${limitText}).`);
    return;
  }
  if (ui.isSubmitting) return;

  ui.isSubmitting = true;
  try {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("invitation_id", props.invitationId);

    imageUpload.files.forEach((file) => {
      formDataToSubmit.append("images[]", file);
    });

    await createGalleries(formDataToSubmit);
    emit(
      "success",
      `${imageUpload.files.length} foto berhasil ditambahkan ke galeri!`
    );

    await refreshData();
    resetForm();
    ui.showForm = false;
  } catch (error) {
    console.error("Failed to upload galleries:", error);

    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Gagal mengunggah foto.";
    emit("error", message);
  } finally {
    ui.isSubmitting = false;
  }
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

const resetForm = () => {
  clearAllImages();
  formData.images = [];
};

const toggleForm = () => {
  if (ui.showForm) {
    resetForm();
  }
  ui.showForm = !ui.showForm;
};

const handleNext = () => {
  emit("next");
};

// Lightbox functionality
const lightbox = reactive({
  show: false,
  currentIndex: 0,
});

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

onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Loading State -->
  <div
    v-if="ui.isLoading"
    class="min-h-[60vh] flex items-center justify-center"
  >
    <div class="text-center space-y-4 md:space-y-6">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 backdrop-blur-sm"
      >
        <div
          class="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
        Memuat galeri foto...
      </p>
    </div>
  </div>

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Gallery Header -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-images text-sky-500 text-lg"></i>
          </div>
          <div>
            <h2
              class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Galeri Foto
            </h2>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ galleries.length }} foto{{
                hasImageLimit ? ` / ${MAX_IMAGES}` : ""
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div v-if="galleries.length > 0">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="(gallery, index) in galleries"
          :key="gallery.id"
          class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer"
        >
          <img
            :src="gallery.image_url"
            :alt="`Gallery ${index + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            @click="openLightbox(index)"
          />

          <!-- Overlay on hover -->
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
          >
            <div
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
            >
              <button
                @click.stop="openLightbox(index)"
                class="w-10 h-10 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center"
                title="Lihat"
              >
                <i class="bi bi-eye-fill"></i>
              </button>
              <button
                @click.stop="openDeleteModal(gallery)"
                class="w-10 h-10 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center"
                title="Hapus"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800"
    >
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
      >
        <i class="bi bi-images text-sky-500 text-3xl"></i>
      </div>
      <h3
        class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
      >
        Belum Ada Foto
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Tambahkan foto-foto indah untuk galeri acara Anda
      </p>
    </div>

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
    <div
      v-if="ui.showForm"
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
    >
      <div class="flex items-center gap-2 mb-1 md:mb-4">
        <div
          class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
        >
          <i class="bi bi-cloud-upload text-sky-500"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Unggah Foto
          <span class="text-xs text-slate-400 font-normal ml-1">
            (Maks {{ maxImagesText }})
          </span>
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 md:space-y-6">
        <!-- Drop Zone -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          :class="[
            'border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-300',
            imageUpload.isDragging
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600',
          ]"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            @change="handleImageSelect"
            class="hidden"
            :disabled="!canAddMoreImages"
          />

          <div v-if="canAddMoreImages">
            <div
              class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
            >
              <i class="bi bi-cloud-arrow-up text-sky-500 text-3xl"></i>
            </div>
            <h4
              class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2"
            >
              Seret & Lepas foto di sini
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mb-4">
              atau klik tombol di bawah untuk memilih foto
            </p>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
            >
              <i class="bi bi-folder2-open mr-1"></i>
              Pilih Foto
            </button>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-4">
              JPG, PNG, WEBP • Max 2MB • {{ remainingSlotsText }}
            </p>
          </div>

          <div v-else class="text-slate-600 dark:text-slate-400">
            <i
              class="bi bi-check-circle-fill text-4xl text-emerald-500 mb-2"
            ></i>
            <p class="text-sm">Maksimal {{ maxImagesText }} foto tercapai</p>
          </div>
        </div>

        <!-- Preview Grid -->
        <div v-if="imageUpload.previews.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-semibold text-slate-900 dark:text-slate-50">
              Preview ({{ imageUpload.previews.length }} foto)
            </h4>
            <button
              type="button"
              @click="clearAllImages"
              class="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <i class="bi bi-x-circle mr-1"></i>
              Hapus Semua
            </button>
          </div>

          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <div
              v-for="(preview, index) in imageUpload.previews"
              :key="preview.id"
              class="group relative aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
            >
              <img
                :src="preview.url"
                :alt="preview.name"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 active:scale-95 flex items-center justify-center"
                title="Hapus"
              >
                <i class="bi bi-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-3">
          <button
            type="button"
            @click="toggleForm"
            :disabled="ui.isSubmitting"
            class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span v-if="!ui.isSubmitting">
              <i class="bi bi-cloud-upload mr-1"></i>
              Unggah {{ imageUpload.files.length }} Foto
            </span>
            <span v-else class="flex items-center gap-2">
              <Spinner />
              Mengunggah...
            </span>
          </button>
        </div>
      </form>
    </div>

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
    <div
      v-if="lightbox.show"
      @click="closeLightbox"
      class="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
    >
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
      >
        <i class="bi bi-x-lg text-xl"></i>
      </button>

      <button
        @click.stop="prevImage"
        class="absolute left-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
      >
        <i class="bi bi-chevron-left text-2xl"></i>
      </button>

      <button
        @click.stop="nextImage"
        class="absolute right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
      >
        <i class="bi bi-chevron-right text-2xl"></i>
      </button>

      <img
        v-if="galleries[lightbox.currentIndex]"
        :src="galleries[lightbox.currentIndex].image_url"
        :alt="`Gallery ${lightbox.currentIndex + 1}`"
        @click.stop
        class="max-w-full max-h-full object-contain rounded-2xl"
      />

      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        {{ lightbox.currentIndex + 1 }} / {{ galleries.length }}
      </div>
    </div>

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
