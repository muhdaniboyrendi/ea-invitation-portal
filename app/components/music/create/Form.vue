<script setup>
const props = defineProps({
  musicId: {
    type: String,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["success", "cancel"]);

// Composables
const { createMusic, updateMusic, fetchMusic, musicsRefresh } = useMusicStore();

// Validation patterns
const validationPatterns = {
  name: {
    required: /^.+$/,
    minLength: /^.{3,}$/,
    message: {
      required: "Nama musik wajib diisi",
      minLength: "Nama musik minimal 3 karakter",
    },
  },
  audio: {
    required: /^.+$/,
    message: {
      required: "File audio wajib diupload",
    },
  },
  thumbnail: {
    required: /^.+$/,
    message: {
      required: "Thumbnail wajib diupload",
    },
  },
};

// Use form validation composable
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
  resetErrors,
} = useFormValidation(validationPatterns);

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

// Audio file upload
const {
  fileInput: audioInput,
  preview: audioPreview,
  isUpdated: isAudioUpdated,
  handleFileChange: handleAudioUpload,
  removeFile: removeAudio,
  reset: resetAudioUpload,
  setPreview: setAudioPreview,
} = useFileUpload({
  allowedTypes: /^audio\/(mpeg|mp3|wav|ogg)$/i,
  maxSize: 20 * 1024 * 1024, // 10MB
  onSuccess: (file) => {
    formData.audio = file;
    clearBackendError("audio");
    if (ui.isFormTouched) {
      validateField("audio", file);
    }
  },
  onError: (message) => {
    showNotification("error", message);
  },
});

// Thumbnail upload
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
  maxSize: 5 * 1024 * 1024, // 5MB
  onSuccess: (file) => {
    formData.thumbnail = file;
    clearBackendError("thumbnail");
    if (ui.isFormTouched) {
      validateField("thumbnail", file);
    }
  },
  onError: (message) => {
    showNotification("error", message);
  },
});

// Initial form state
const initialFormState = {
  name: "",
  artist: "",
  audio: null,
  thumbnail: null,
};

// Reactive state
const formData = reactive({ ...initialFormState });
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  isFormTouched: false,
});

// Timeout refs untuk cleanup - FIX MEMORY LEAK
const nameValidationTimeout = ref(null);
const artistValidationTimeout = ref(null);

// Computed
const isEditMode = computed(() => props.musicId !== null);
const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  return !!(
    formData.name.trim() &&
    formData.artist.trim() &&
    formData.audio &&
    formData.thumbnail
  );
});

// Validation functions
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;

  if (field === "audio" || field === "thumbnail") {
    if (!value || (!(value instanceof File) && typeof value !== "string")) {
      return validateWithPattern(field, "", pattern);
    }
    return true;
  }

  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;

  if (!validateField("name", formData.name)) isValid = false;
  if (!validateField("artist", formData.artist)) isValid = false;
  if (!validateField("audio", formData.audio)) isValid = false;
  if (!validateField("thumbnail", formData.thumbnail)) isValid = false;

  return isValid;
};

// Form handlers
const resetForm = () => {
  Object.assign(formData, { ...initialFormState });
  resetErrors();
  resetAudioUpload();
  resetThumbnailUpload();
  ui.isFormTouched = false;

  // Clear timeouts
  if (nameValidationTimeout.value) clearTimeout(nameValidationTimeout.value);
  if (artistValidationTimeout.value)
    clearTimeout(artistValidationTimeout.value);
};

// Input handlers with debounce - OPTIMIZED
const handleNameInput = () => {
  ui.isFormTouched = true;
  clearBackendError("name");

  if (nameValidationTimeout.value) {
    clearTimeout(nameValidationTimeout.value);
  }

  nameValidationTimeout.value = setTimeout(() => {
    validateField("name", formData.name);
  }, 300);
};

const handleArtistInput = () => {
  ui.isFormTouched = true;
  clearBackendError("artist");

  if (artistValidationTimeout.value) {
    clearTimeout(artistValidationTimeout.value);
  }

  artistValidationTimeout.value = setTimeout(() => {
    validateField("artist", formData.artist);
  }, 300);
};

const handleAudioChange = (event) => {
  const file = handleAudioUpload(event);
  if (file) {
    formData.audio = file;
  }
};

const handleAudioRemove = () => {
  removeAudio();
  formData.audio = null;
  clearBackendError("audio");
  if (ui.isFormTouched) {
    validateField("audio", null);
  }
};

const handleThumbnailChange = (event) => {
  const file = handleThumbnailUpload(event);
  if (file) {
    formData.thumbnail = file;
  }
};

const handleThumbnailRemove = () => {
  removeThumbnail();
  formData.thumbnail = null;
  clearBackendError("thumbnail");
  if (ui.isFormTouched) {
    validateField("thumbnail", null);
  }
};

// Data fetching
const fetchMusicData = async () => {
  if (!props.musicId) return;

  ui.isLoading = true;
  try {
    const musicData = await fetchMusic(props.musicId);
    Object.assign(formData, {
      name: musicData.name || "",
      artist: musicData.artist || "",
      audio: musicData.audio || null,
      thumbnail: musicData.thumbnail || null,
    });

    if (musicData.audio && typeof musicData.audio === "string") {
      setAudioPreview(musicData.audio_url);
    }

    if (musicData.thumbnail && typeof musicData.thumbnail === "string") {
      setThumbnailPreview(musicData.thumbnail_url);
    }
  } catch (error) {
    console.error("Error fetching music:", error);
    showNotification("error", "Gagal memuat data musik. Silakan coba lagi.");
  } finally {
    ui.isLoading = false;
  }
};

// Form submission
const submitForm = async () => {
  ui.isFormTouched = true;

  if (!validateForm()) {
    showNotification("warning", "Mohon lengkapi semua field yang wajib diisi.");
    return;
  }

  ui.isSubmitting = true;
  try {
    const dataToSubmit = { ...formData };

    // Don't send files if not updated in edit mode
    if (isEditMode.value) {
      if (!isAudioUpdated.value) {
        dataToSubmit.audio = null;
      }
      if (!isThumbnailUpdated.value) {
        dataToSubmit.thumbnail = null;
      }
    }

    if (isEditMode.value) {
      await updateMusic(props.musicId, dataToSubmit);
      showNotification("success", "Musik berhasil diperbarui!");
    } else {
      await createMusic(dataToSubmit);
      showNotification("success", "Musik berhasil ditambahkan!");
      resetForm();
    }

    musicsRefresh();
    emit("success");
  } catch (error) {
    console.error(
      `Error ${isEditMode.value ? "updating" : "creating"} music:`,
      error
    );

    if (error?.validationErrors || error?.response?.data?.validationErrors) {
      const backendErrors =
        error.validationErrors || error.response.data.validationErrors;
      setBackendValidationErrors(backendErrors);

      const generalMessage =
        error?.message ||
        error?.response?.data?.message ||
        `Gagal ${
          isEditMode.value ? "memperbarui" : "menambahkan"
        } musik. Periksa form dan coba lagi.`;
      showNotification("error", generalMessage);
    } else {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        `Gagal ${
          isEditMode.value ? "memperbarui" : "menambahkan"
        } musik. Silakan coba lagi.`;
      showNotification("error", message);
    }
  } finally {
    ui.isSubmitting = false;
  }
};

// Watchers
watch(
  () => props.musicId,
  (newId) => {
    if (newId) {
      fetchMusicData();
    } else {
      resetForm();
    }
  }
);

// Lifecycle - CLEANUP UNTUK PREVENT MEMORY LEAK
onMounted(() => {
  if (isEditMode.value) {
    fetchMusicData();
  }
});

onUnmounted(() => {
  // Clear all timeouts
  if (nameValidationTimeout.value) {
    clearTimeout(nameValidationTimeout.value);
  }
  if (artistValidationTimeout.value) {
    clearTimeout(artistValidationTimeout.value);
  }

  // Clear any other resources if needed
  resetForm();
});
</script>

<template>
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
    <!-- Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <!-- Header -->
    <header class="mb-6">
      <h2
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        <div
          class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
        >
          <i
            :class="
              isEditMode ? 'bi bi-pencil-square' : 'bi bi-music-note-beamed'
            "
            class="text-purple-600 dark:text-purple-400"
          />
        </div>
        {{ isEditMode ? "Edit Musik" : "Tambah Musik" }}
      </h2>
    </header>

    <!-- Loading State -->
    <div v-if="ui.isLoading" class="text-center py-8">
      <div
        class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
      >
        <Spinner />
        <p>Memuat data musik...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else>
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Music Name -->
        <FormBaseInput
          v-model="formData.name"
          label="Nama Musik"
          placeholder="Contoh: Beautiful Day"
          :required="true"
          :error="validationErrors.name"
          @input="handleNameInput"
        />

        <!-- Artist Name -->
        <FormBaseInput
          v-model="formData.artist"
          label="Nama Artis"
          placeholder="Contoh: John Doe"
          :required="false"
          :error="validationErrors.artist"
          @input="handleArtistInput"
        />

        <!-- Audio File Upload -->
        <FormAudioUpload
          ref="audioInput"
          label="File Audio"
          :required="true"
          :preview="audioPreview"
          :error="validationErrors.audio"
          @change="handleAudioChange"
          @remove="handleAudioRemove"
        />

        <!-- Thumbnail Upload -->
        <FormImageUpload
          ref="thumbnailInput"
          label="Thumbnail"
          :required="true"
          :preview="thumbnailPreview"
          :error="validationErrors.thumbnail"
          @change="handleThumbnailChange"
          @remove="handleThumbnailRemove"
        />

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-6">
          <button
            type="button"
            @click="resetForm"
            :disabled="ui.isSubmitting"
            class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              {{ isEditMode ? "Perbarui Musik" : "Simpan Musik" }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
