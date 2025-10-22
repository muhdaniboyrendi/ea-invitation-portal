<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchLoveStories, createLoveStory, updateLoveStory, deleteLoveStory } =
  useLoveStoryStore();

const validationPatterns = {
  title: {
    required: /^.+$/,
    message: { required: "Judul cerita wajib diisi" },
  },
};

// Form Validation Composable
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
  resetErrors,
} = useFormValidation(validationPatterns);

// File Upload for Thumbnail
const {
  fileInput: thumbnailInput,
  preview: thumbnailPreview,
  isUpdated: isThumbnailUpdated,
  handleFileChange: handleThumbnailUpload,
  removeFile: removeThumbnail,
  reset: resetThumbnailUpload,
  setPreview: setThumbnailPreview,
} = useFileUpload({
  allowedTypes: /^image\/(jpeg|jpg|png|webp)$/i,
  maxSize: 2 * 1024 * 1024, // 2 MB
  onSuccess: (file) => {
    formData.thumbnail = file;
    clearBackendError("thumbnail");
  },
  onError: (message) => emit("error", message),
});

// Reactive form data object
const formData = reactive({
  id: null,
  invitation_id: props.invitationId,
  title: "",
  date: "",
  description: "",
  thumbnail: null,
});

const ui = reactive({
  isLoading: true,
  isSubmitting: false,
  showForm: false,
  editingId: null,
});

// Delete Modal State
const deleteModal = reactive({
  show: false,
  isDeleting: false,
  storyId: null,
  storyTitle: "",
});

const loveStories = ref([]);

// Computed Properties
const isEditMode = computed(() => !!ui.editingId);

const isFormValid = computed(() => {
  return Object.keys(validationErrors.value).length === 0 && formData.title;
});

// Validation Methods
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;
  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;
  if (!validateField("title", formData.title)) isValid = false;
  return isValid;
};

// Input Handlers
const handleInput = (field, value) => {
  clearBackendError(field);
  validateField(field, value);
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// API Calls
const fetchData = async () => {
  ui.isLoading = true;
  try {
    const response = await fetchLoveStories(props.invitationId);
    loveStories.value = response || [];
  } catch (error) {
    console.error("Failed to fetch love stories:", error);
  } finally {
    ui.isLoading = false;
  }
};

const submitForm = async () => {
  if (!validateForm()) {
    emit("error", "Mohon periksa kembali, ada data yang belum valid.");
    return;
  }
  if (ui.isSubmitting) return;

  ui.isSubmitting = true;
  try {
    const dataToSubmit = { ...formData };

    // If in edit mode and thumbnail is not updated, don't send the thumbnail file
    if (isEditMode.value && !isThumbnailUpdated.value) {
      dataToSubmit.thumbnail = null;
    }

    if (isEditMode.value) {
      await updateLoveStory(ui.editingId, dataToSubmit);
      emit("success", "Cerita cinta berhasil diperbarui!");
    } else {
      await createLoveStory(dataToSubmit);
      emit("success", "Cerita cinta berhasil ditambahkan!");
    }

    await fetchData();
    resetForm();
    ui.showForm = false;
  } catch (error) {
    const backendErrors =
      error?.validationErrors || error?.response?.data?.validationErrors;
    if (backendErrors) setBackendValidationErrors(backendErrors);

    const message =
      error?.message ||
      error?.response?.data?.message ||
      `Gagal ${isEditMode.value ? "memperbarui" : "menyimpan"} data.`;
    emit("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const handleEdit = (story) => {
  ui.editingId = story.id;
  Object.assign(formData, {
    id: story.id,
    invitation_id: props.invitationId,
    title: story.title || "",
    date: story.date || "",
    description: story.description || "",
    thumbnail: story.thumbnail || null,
  });

  // Set thumbnail preview if exists
  if (story.thumbnail_url) {
    setThumbnailPreview(story.thumbnail_url);
  }

  ui.showForm = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Delete Modal Handlers
const openDeleteModal = (story) => {
  deleteModal.storyId = story.id;
  deleteModal.storyTitle = story.title;
  deleteModal.show = true;
};

const closeDeleteModal = () => {
  if (!deleteModal.isDeleting) {
    deleteModal.show = false;
    deleteModal.storyId = null;
    deleteModal.storyTitle = "";
  }
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteLoveStory(deleteModal.storyId);
    emit("success", "Kisah berhasil dihapus!");
    closeDeleteModal();
    await fetchData();
  } catch (error) {
    const message = error?.message || "Gagal menghapus kisah.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    invitation_id: props.invitationId,
    title: "",
    date: "",
    description: "",
    thumbnail: null,
  });

  ui.editingId = null;
  resetErrors();
  resetThumbnailUpload();
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
      <p>Memuat cerita cinta...</p>
    </div>
  </div>

  <div v-else>
    <!-- Love Story List -->
    <div v-if="loveStories.length > 0" class="mb-8 space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Kisah Cinta Kami ({{ loveStories.length }})
        </h3>
      </div>

      <div
        v-for="story in loveStories"
        :key="story.id"
        class="bg-white dark:bg-dark rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col md:flex-row">
          <!-- Thumbnail -->
          <div
            v-if="story.thumbnail_url"
            class="md:w-48 h-48 md:h-auto flex-shrink-0"
          >
            <img
              :src="story.thumbnail_url"
              :alt="story.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="md:w-48 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 flex items-center justify-center"
          >
            <i
              class="bi bi-heart-fill text-5xl text-pink-400 dark:text-pink-600"
            ></i>
          </div>

          <!-- Content -->
          <div class="flex-1 p-6">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4
                  class="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {{ story.title }}
                </h4>
                <p
                  v-if="story.date"
                  class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                >
                  <i class="bi bi-calendar-heart"></i>
                  {{ formatDate(story.date) }}
                </p>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="handleEdit(story)"
                  class="h-8 aspect-square bg-linear-to-br from-blue-500 to-purple-500 hover:fromm-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
                  title="Edit"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button
                  @click="openDeleteModal(story)"
                  class="h-8 aspect-square bg-linear-to-br from-red-500 to-rose-500 hover:fromm-red-600 hover:to-rose-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
                  title="Hapus"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>

            <p
              v-if="story.description"
              class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3"
            >
              {{ story.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center mb-8 border-2 border-dashed border-pink-200 dark:border-pink-800"
    >
      <i class="bi bi-heart text-6xl text-pink-300 dark:text-pink-700"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">
        Belum Ada Cerita
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Ceritakan kisah cinta kalian yang indah
      </p>
    </div>

    <!-- Add/Edit Form Toggle Button -->
    <div class="mb-6">
      <button
        @click="toggleForm"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
        {{ ui.showForm ? "Batal" : "Tambah Cerita Baru" }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="ui.showForm">
      <div class="mb-6">
        <h3
          class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="bi bi-heart-fill text-blue-500"></i>
          {{ isEditMode ? "Edit Cerita" : "Tambah Cerita Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <FormBaseInput
          v-model="formData.title"
          type="text"
          label="Judul Cerita"
          placeholder="contoh: Pertemuan Pertama Kami"
          :required="true"
          :error="validationErrors.title"
          @input="handleInput('title', formData.title)"
        />

        <FormBaseInput
          v-model="formData.date"
          type="date"
          label="Tanggal (Opsional)"
          :error="validationErrors.date"
          @input="handleInput('date', formData.date)"
        />

        <FormBaseTextarea
          v-model="formData.description"
          label="Cerita (Opsional)"
          placeholder="Ceritakan momen spesial kalian..."
          :rows="5"
          :maxlength="1000"
          :error="validationErrors.description"
          @input="handleInput('description', formData.description)"
        />

        <FormImageUpload
          ref="thumbnailInput"
          label="Foto Cerita (Opsional, Max 2MB)"
          :preview="thumbnailPreview"
          :error="validationErrors.thumbnail"
          @change="
            (e) => {
              const file = handleThumbnailUpload(e);
              if (file) formData.thumbnail = file;
            }
          "
          @remove="
            () => {
              removeThumbnail();
              formData.thumbnail = null;
              clearBackendError('thumbnail');
            }
          "
        />

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
              {{ isEditMode ? "Perbarui Cerita" : "Simpan Cerita" }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
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
        Cerita cinta bersifat opsional, Anda bisa melewatinya
      </p>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="deleteModal.show"
      :is-deleting="deleteModal.isDeleting"
      title="Hapus Kisah?"
      message="Apakah Anda yakin ingin menghapus kisah"
      :item-name="deleteModal.storyTitle"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>
