<script setup>
const props = defineProps({
  themeId: {
    type: String,
    required: false,
    default: null,
  },
});

const { createTheme, updateTheme, fetchTheme, themesRefresh } = useThemeStore();
const { categories } = storeToRefs(useThemeCategoryStore());

const validationPatterns = {
  name: {
    required: /^.+$/,
    minLength: /^.{3,}$/,
    message: {
      required: "Nama tema wajib diisi",
      minLength: "Nama tema minimal 3 karakter",
    },
  },
  link: {
    url: /^https?:\/\/(?:[-\w.])+(?:\.[a-zA-Z]{2,})+(?:\/[^?\s]*)?(?:\?[^#\s]*)?(?:#[^\s]*)?$/,
    required: /^.+$/,
    message: {
      required: "Link tema wajib diisi",
      url: "Link harus berupa URL yang valid",
    },
  },
  category: {
    required: /^.+$/,
    message: {
      required: "Kategori tema wajib dipilih",
    },
  },
  thumbnail: {
    required: /^.+$/,
    message: {
      required: "Thumbnail wajib diupload",
    },
  },
};

// Use composables
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
  resetErrors,
} = useFormValidation(validationPatterns);

// Notification state - Updated for popup
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

const {
  fileInput,
  preview: thumbnailPreview,
  isUpdated: isThumbnailUpdated,
  handleFileChange: handleFileUpload,
  removeFile: removeThumbnail,
  reset: resetFileUpload,
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
  theme_category_id: "",
  link: "",
  thumbnail: null,
  is_premium: false,
};

// Reactive state
const formData = reactive({ ...initialFormState });
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  isFormTouched: false,
});

// Computed
const isEditMode = computed(() => props.themeId !== null);
const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  return !!(
    formData.name.trim() &&
    formData.theme_category_id &&
    formData.link.trim() &&
    formData.thumbnail
  );
});

// Validation functions
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;

  if (field === "thumbnail") {
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
  if (!validateField("theme_category_id", formData.theme_category_id))
    isValid = false;
  if (!validateField("link", formData.link)) isValid = false;
  if (!validateField("thumbnail", formData.thumbnail)) isValid = false;

  return isValid;
};

// Form handlers
const resetForm = () => {
  Object.assign(formData, { ...initialFormState });
  resetErrors();
  resetFileUpload();
  ui.isFormTouched = false;
};

// Enhanced input handlers
const handleNameInput = () => {
  ui.isFormTouched = true;
  clearBackendError("name");
  clearTimeout(window.nameValidationTimeout);
  window.nameValidationTimeout = setTimeout(() => {
    validateField("name", formData.name);
  }, 300);
};

const handleCategoryChange = () => {
  ui.isFormTouched = true;
  clearBackendError("theme_category_id");
  validateField("theme_category_id", formData.theme_category_id);
};

const handleLinkInput = () => {
  ui.isFormTouched = true;
  clearBackendError("link");
  clearTimeout(window.linkValidationTimeout);
  window.linkValidationTimeout = setTimeout(() => {
    validateField("link", formData.link);
  }, 300);
};

const handlePremiumChange = () => {
  ui.isFormTouched = true;
  clearBackendError("is_premium");
};

const handleThumbnailChange = (event) => {
  const file = handleFileUpload(event);
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
const fetchThemeData = async () => {
  if (!props.themeId) return;

  ui.isLoading = true;
  try {
    const themeData = await fetchTheme(props.themeId);
    Object.assign(formData, {
      name: themeData.name || "",
      theme_category_id: themeData.theme_category_id?.toString() || "",
      link: themeData.link || "",
      thumbnail: themeData.thumbnail || null,
      is_premium: Boolean(themeData.is_premium),
    });

    if (themeData.thumbnail && typeof themeData.thumbnail === "string") {
      setThumbnailPreview(themeData.thumbnail_url);
    }
  } catch (error) {
    console.error("Error fetching theme:", error);
    showNotification("error", "Gagal memuat data tema. Silakan coba lagi.");
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

    if (isEditMode.value && !isThumbnailUpdated.value) {
      dataToSubmit.thumbnail = null;
    }

    if (isEditMode.value) {
      await updateTheme(props.themeId, dataToSubmit);
      showNotification("success", "Tema berhasil diperbarui!");
    } else {
      await createTheme(dataToSubmit);
      showNotification("success", "Tema berhasil ditambahkan!");
      resetForm();
    }

    themesRefresh();
  } catch (error) {
    console.error(
      `Error ${isEditMode.value ? "updating" : "creating"} theme:`,
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
        } tema. Periksa form dan coba lagi.`;
      showNotification("error", generalMessage);
    } else {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        `Gagal ${
          isEditMode.value ? "memperbarui" : "menambahkan"
        } tema. Silakan coba lagi.`;
      showNotification("error", message);
    }
  } finally {
    ui.isSubmitting = false;
  }
};

// Watchers
watch(
  () => props.themeId,
  (newId) => {
    if (newId) {
      fetchThemeData();
    } else {
      resetForm();
    }
  }
);

// Lifecycle
onMounted(() => {
  if (isEditMode.value) {
    fetchThemeData();
  }
});
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8">
    <!-- Popup Alert Notification -->
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
        class="text-2xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-3"
      >
        <div
          class="w-8 h-8 bg-sky-50 dark:bg-sky-950/30 rounded-lg flex items-center justify-center"
        >
          <i
            :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-lg'"
            class="text-sky-500 dark:text-sky-400"
          />
        </div>
        {{ isEditMode ? "Edit Tema" : "Tambah Tema" }}
      </h2>
    </header>

    <!-- Loading State -->
    <div v-if="ui.isLoading" class="text-center py-8">
      <div
        class="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-300"
      >
        <Spinner />
        <p>Memuat data tema...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else>
      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Theme Name -->
        <FormBaseInput
          v-model="formData.name"
          label="Nama Tema"
          placeholder="Contoh: Modern Wedding Theme"
          :required="true"
          :error="validationErrors.name"
          @input="handleNameInput"
        />

        <!-- Category and Premium Status -->
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Theme Category -->
          <FormBaseSelect
            v-model="formData.theme_category_id"
            label="Kategori Tema"
            placeholder="Pilih Kategori"
            :options="categories"
            :required="true"
            :error="validationErrors.theme_category_id"
            @change="handleCategoryChange"
          />

          <!-- Premium Status -->
          <ThemesCreateFormPremiumCheckbox
            v-model="formData.is_premium"
            :error="validationErrors.is_premium"
            @change="handlePremiumChange"
          />
        </div>

        <!-- Theme Link -->
        <FormBaseInput
          v-model="formData.link"
          label="Link Tema"
          placeholder="https://example.com/theme-demo"
          :required="true"
          :error="validationErrors.link"
          @input="handleLinkInput"
        />

        <!-- Thumbnail Upload -->
        <FormImageUpload
          ref="fileInput"
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
            class="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 text-slate-900 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              {{ isEditMode ? "Perbarui Tema" : "Simpan Tema" }}
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
