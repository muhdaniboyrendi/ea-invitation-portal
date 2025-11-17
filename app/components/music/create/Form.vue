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
  maxSize: 20 * 1024 * 1024,
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
  maxSize: 5 * 1024 * 1024,
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

// Timeout refs untuk cleanup
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

  if (nameValidationTimeout.value) clearTimeout(nameValidationTimeout.value);
  if (artistValidationTimeout.value)
    clearTimeout(artistValidationTimeout.value);
};

// Input handlers with debounce
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

// Lifecycle
onMounted(() => {
  if (isEditMode.value) {
    fetchMusicData();
  }
});

onUnmounted(() => {
  if (nameValidationTimeout.value) {
    clearTimeout(nameValidationTimeout.value);
  }
  if (artistValidationTimeout.value) {
    clearTimeout(artistValidationTimeout.value);
  }
  resetForm();
});
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
  >
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
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
        >
          <i
            :class="isEditMode ? 'bi-pencil-square' : 'bi-music-note-beamed'"
            class="text-sky-500 text-lg"
          />
        </div>
        <h2
          class="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50"
        >
          {{ isEditMode ? "Edit Musik" : "Tambah Musik" }}
        </h2>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="ui.isLoading" class="text-center py-12">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 mb-4"
      >
        <div
          class="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
        Memuat data musik...
      </p>
    </div>

    <!-- Form Content -->
    <div v-else>
      <form @submit.prevent="submitForm" class="space-y-4 md:space-y-6">
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
          :enable-compression="false"
          help-text="Format: MP3, WAV, OGG, M4A (Maks. 20MB)"
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
        <div class="flex gap-3">
          <button
            type="button"
            @click="resetForm"
            :disabled="ui.isSubmitting"
            class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <i class="bi bi-arrow-clockwise text-lg"></i>
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
  </div>
</template>
