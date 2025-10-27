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

// ✅ Dynamic MAX_IMAGES based on packageId
const MAX_IMAGES = computed(() => {
  const pkgId = Number(props.packageId);

  if (pkgId === 1) return 4;
  if (pkgId === 2) return 10;
  if (pkgId === 3) return 50;
  if (pkgId > 3) return Infinity; // No limit

  return 10; // Default fallback
});

// ✅ Check if package has limit
const hasImageLimit = computed(() => {
  return MAX_IMAGES.value !== Infinity;
});

// ✅ Display text for max images
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

// ✅ Display text for remaining slots
const remainingSlotsText = computed(() => {
  if (!hasImageLimit.value) return "Tidak Terbatas";
  return `${remainingSlots.value} slot tersisa`;
});

// ✅ Check if can add more images
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
  // Reset errors
  imageUpload.errors = [];

  // ✅ Check total count with dynamic limit
  const totalCount = imageUpload.files.length + files.length;

  if (hasImageLimit.value && totalCount > MAX_IMAGES.value) {
    imageUpload.errors.push(
      `Maksimal ${MAX_IMAGES.value} foto. Anda sudah memiliki ${imageUpload.files.length} foto.`
    );
    return;
  }

  // Validate and process each file
  files.forEach((file) => {
    const errors = validateImage(file);

    if (errors.length > 0) {
      imageUpload.errors.push(...errors);
    } else {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUpload.previews.push({
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);

      // Add file
      imageUpload.files.push(file);
    }
  });

  // Show errors if any
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
  // ✅ Validation message with dynamic limit
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
    console.error("Failed to upload galleries:", error.validationErrors);

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
  <div v-if="ui.isLoading" class="text-center py-8">
    <div
      class="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>
      <p>Memuat galeri foto...</p>
    </div>
  </div>

  <div v-else>
    <!-- Gallery Grid -->
    <div v-if="galleries.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Galeri Foto ({{ galleries.length
          }}{{ hasImageLimit ? ` / ${MAX_IMAGES}` : "" }})
        </h3>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(gallery, index) in galleries"
          :key="gallery.id"
          class="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer"
        >
          <img
            :src="gallery.image_url"
            :alt="`Gallery ${index + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            @click="openLightbox(index)"
          />

          <!-- Overlay on hover -->
          <div
            class="absolute inset-0 group-hover:bg-black/40 group-hover:backdrop-blur-xs transition-all duration-300 flex items-center justify-center"
          >
            <div
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
            >
              <button
                @click.stop="openLightbox(index)"
                class="h-10 aspect-square bg-linear-to-br from-blue-500 to-purple-500 text-white rounded-xl hover:scale-110 transition-transform"
                title="Lihat"
              >
                <i class="bi bi-eye-fill"></i>
              </button>
              <button
                @click.stop="openDeleteModal(gallery)"
                class="h-10 aspect-square bg-linear-to-br from-red-500 to-rose-500 text-white rounded-xl hover:scale-110 transition-transform"
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
      class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center mb-8 border-2 border-dashed border-blue-200 dark:border-blue-800"
    >
      <i class="bi bi-images text-6xl text-blue-300 dark:text-blue-700"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">
        Belum Ada Foto
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Tambahkan foto-foto indah untuk galeri acara Anda
      </p>
    </div>

    <!-- Add Form Toggle Button -->
    <div class="mb-6">
      <button
        @click="toggleForm"
        class="w-full px-6 py-3 bg-gradient-to-r text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        :class="
          ui.showForm
            ? 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
            : 'from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
        "
      >
        <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
        {{ ui.showForm ? "Batal" : "Tambah Foto" }}
      </button>
    </div>

    <!-- Upload Form -->
    <div v-if="ui.showForm">
      <div class="mb-6">
        <h3
          class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="bi bi-images text-blue-500"></i>
          Unggah Foto
          <span v-if="hasImageLimit">(Maksimal {{ maxImagesText }} foto)</span>
          <span v-else>(Tidak Terbatas)</span>
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Drop Zone -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          :class="[
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300',
            imageUpload.isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600',
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
            <i
              class="bi bi-cloud-arrow-up text-6xl text-gray-400 dark:text-gray-600 mb-4"
            ></i>
            <h4
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Seret & Lepas foto di sini
            </h4>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              atau klik tombol di bawah untuk memilih foto
            </p>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <i class="bi bi-folder2-open mr-2"></i>
              Pilih Foto
            </button>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Format: JPG, PNG, WEBP • Maksimal 2MB per foto •
              {{ remainingSlotsText }}
            </p>
          </div>

          <div v-else class="text-gray-600 dark:text-gray-400">
            <i class="bi bi-check-circle-fill text-4xl text-green-500 mb-2"></i>
            <p>Maksimal {{ maxImagesText }} foto tercapai</p>
          </div>
        </div>

        <!-- Preview Grid -->
        <div v-if="imageUpload.previews.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-900 dark:text-white">
              Preview ({{ imageUpload.previews.length }} foto)
            </h4>
            <button
              type="button"
              @click="clearAllImages"
              class="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              <i class="bi bi-x-circle mr-1"></i>
              Hapus Semua
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="(preview, index) in imageUpload.previews"
              :key="preview.id"
              class="group relative aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
            >
              <img
                :src="preview.url"
                :alt="preview.name"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:scale-110"
                title="Hapus"
              >
                <i class="bi bi-trash-fill text-sm"></i>
              </button>
              <div
                class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate"
              >
                {{ preview.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="toggleForm"
            :disabled="ui.isSubmitting"
            class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-700 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              Unggah {{ imageUpload.files.length }} Foto
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Spinner />
              Mengunggah...
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Next Button -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        @click="handleNext"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Lanjutkan
        <i class="bi bi-arrow-right ml-2"></i>
      </button>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
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
        class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
      >
        <i class="bi bi-x-lg"></i>
      </button>

      <button
        @click.stop="prevImage"
        class="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <button
        @click.stop="nextImage"
        class="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

      <img
        v-if="galleries[lightbox.currentIndex]"
        :src="galleries[lightbox.currentIndex].image_url"
        :alt="`Gallery ${lightbox.currentIndex + 1}`"
        @click.stop
        class="max-w-full max-h-full object-contain rounded-lg"
      />

      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full"
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
          class="w-full h-48 object-cover rounded-lg mt-4"
        />
      </template>
    </ConfirmDeleteModal>
  </div>
</template>
