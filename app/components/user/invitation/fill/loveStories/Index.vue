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
  maxSize: 2 * 1024 * 1024,
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

const refreshData = async () => {
  try {
    const response = await fetchLoveStories(props.invitationId);
    loveStories.value = response || [];
  } catch (error) {
    console.error("Failed to fetch love stories:", error);
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

    await refreshData();
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
        Memuat cerita cinta...
      </p>
    </div>
  </div>

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Love Story List Header -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-heart-fill text-sky-500 text-lg"></i>
          </div>
          <div>
            <h2
              class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Kisah Cinta Kami
            </h2>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ loveStories.length }} cerita tersimpan
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Love Story List -->
    <div v-if="loveStories.length > 0" class="space-y-3">
      <div
        v-for="story in loveStories"
        :key="story.id"
        class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row">
          <!-- Thumbnail -->
          <div
            v-if="story.thumbnail_url"
            class="sm:w-32 h-32 sm:h-auto flex-shrink-0"
          >
            <img
              :src="story.thumbnail_url"
              :alt="story.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900 flex items-center justify-center"
          >
            <i class="bi bi-heart-fill text-3xl text-sky-500"></i>
          </div>

          <!-- Content -->
          <div class="flex-1 p-4 md:p-6">
            <div class="flex items-start gap-3 mb-2">
              <div class="flex-1 min-w-0">
                <h4
                  class="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50 mb-1"
                >
                  {{ story.title }}
                </h4>
                <p
                  v-if="story.date"
                  class="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <i class="bi bi-calendar-heart text-sky-500"></i>
                  {{ formatDate(story.date) }}
                </p>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  @click="handleEdit(story)"
                  class="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 transition-all active:scale-95"
                  title="Edit"
                >
                  <i class="bi bi-pencil text-sm"></i>
                </button>
                <button
                  @click="openDeleteModal(story)"
                  class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-all active:scale-95"
                  title="Hapus"
                >
                  <i class="bi bi-trash text-sm"></i>
                </button>
              </div>
            </div>

            <p
              v-if="story.description"
              class="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2"
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
      class="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800"
    >
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
      >
        <i class="bi bi-heart text-sky-500 text-3xl"></i>
      </div>
      <h3
        class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
      >
        Belum Ada Cerita
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Ceritakan kisah cinta kalian yang indah
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
      {{ ui.showForm ? "Batal" : "Tambah Cerita Baru" }}
    </button>

    <!-- Add/Edit Form -->
    <div
      v-if="ui.showForm"
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
    >
      <div class="flex items-center gap-2 mb-1 md:mb-4">
        <div
          class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
        >
          <i class="bi bi-heart-fill text-sky-500"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {{ isEditMode ? "Edit Cerita" : "Tambah Cerita Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 md:space-y-6">
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
          label="Tanggal"
          :error="validationErrors.date"
          @input="handleInput('date', formData.date)"
        >
          <template #hint>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              Opsional
            </span>
          </template>
        </FormBaseInput>

        <FormBaseTextarea
          v-model="formData.description"
          label="Cerita"
          placeholder="Ceritakan momen spesial kalian..."
          :rows="5"
          :maxlength="1000"
          :error="validationErrors.description"
          @input="handleInput('description', formData.description)"
        >
          <template #hint>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              Opsional - Maksimal 1000 karakter
            </span>
          </template>
        </FormBaseTextarea>

        <div>
          <label
            class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
          >
            Foto Cerita
            <span class="text-xs text-slate-400 font-normal ml-1"
              >(Opsional, Max 2MB)</span
            >
          </label>
          <FormImageUpload
            ref="thumbnailInput"
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
              <i
                :class="isEditMode ? 'bi-check-circle' : 'bi-save'"
                class="bi mr-1"
              ></i>
              {{ isEditMode ? "Perbarui" : "Simpan" }}
            </span>
            <span v-else class="flex items-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
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
