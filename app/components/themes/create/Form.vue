<script setup>
// Props
const props = defineProps({
  themeId: {
    type: String,
    required: false,
    default: null,
  },
});

// Composables
const { createTheme, updateTheme, fetchTheme, themesRefresh } = useThemeStore();
const { categories } = storeToRefs(useThemeCategoryStore());

// Regex patterns for validation
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
};

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
const frontendErrors = ref({});
const backendErrors = ref({});
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  showSuccess: false,
  showError: false,
  errorMessage: "",
  isFormTouched: false,
});

// File upload state
const fileInput = ref(null);
const thumbnailPreview = ref(null);

// Computed
const isEditMode = computed(() => props.themeId !== null);
const isFormValid = computed(() => {
  // Check if no validation errors exist
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  // Check if required fields are filled (using trimmed values for strings)
  return !!(
    formData.name.trim() &&
    formData.theme_category_id &&
    formData.link.trim() &&
    formData.thumbnail
  );
});

const validationErrors = computed(() => ({
  ...frontendErrors.value,
  ...backendErrors.value,
}));

// Utility functions
const showNotification = (type, message, duration = 5000) => {
  if (type === "success") {
    ui.showSuccess = true;
    setTimeout(() => {
      ui.showSuccess = false;
    }, duration);
  } else {
    ui.showError = true;
    ui.errorMessage = message;
    setTimeout(() => {
      ui.showError = false;
      ui.errorMessage = "";
    }, duration);
  }
};

const resetForm = () => {
  Object.assign(formData, { ...initialFormState });
  frontendErrors.value = {};
  backendErrors.value = {};
  ui.isFormTouched = false;
  ui.errorMessage = "";
  thumbnailPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Clear backend validation errors when user starts typing
const clearBackendError = (field) => {
  if (backendErrors.value[field]) {
    delete backendErrors.value[field];
  }
};

// Set backend validation errors
const setBackendValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") return;

  backendErrors.value = {};

  Object.keys(errors).forEach((field) => {
    if (errors[field]) {
      if (Array.isArray(errors[field])) {
        backendErrors.value[field] = errors[field][0];
      } else {
        backendErrors.value[field] = errors[field];
      }
    }
  });
};

// Regex-based validation functions
const validateField = (field, value) => {
  // Clear previous frontend error
  if (frontendErrors.value[field]) {
    delete frontendErrors.value[field];
  }

  switch (field) {
    case "name":
      return validateName(value);
    case "theme_category_id":
      return validateCategory(value);
    case "link":
      return validateLink(value);
    case "thumbnail":
      return validateThumbnail(value);
    default:
      return true;
  }
};

const validateName = (value) => {
  const trimmedValue = value ? value.trim() : "";

  if (!validationPatterns.name.required.test(trimmedValue)) {
    frontendErrors.value.name = validationPatterns.name.message.required;
    return false;
  }

  if (!validationPatterns.name.minLength.test(trimmedValue)) {
    frontendErrors.value.name = validationPatterns.name.message.minLength;
    return false;
  }

  return true;
};

const validateCategory = (value) => {
  if (!validationPatterns.category.required.test(value || "")) {
    frontendErrors.value.theme_category_id =
      validationPatterns.category.message.required;
    return false;
  }

  return true;
};

const validateLink = (value) => {
  const trimmedValue = value ? value.trim() : "";

  if (!validationPatterns.link.required.test(trimmedValue)) {
    frontendErrors.value.link = validationPatterns.link.message.required;
    return false;
  }

  if (!validationPatterns.link.url.test(trimmedValue)) {
    frontendErrors.value.link = validationPatterns.link.message.url;
    return false;
  }

  return true;
};

const validateThumbnail = (value) => {
  if (!value || (!(value instanceof File) && typeof value !== "string")) {
    frontendErrors.value.thumbnail = "Thumbnail wajib diupload";
    return false;
  }

  return true;
};

const validateForm = () => {
  let isValid = true;

  // Validate all fields using current form data
  if (!validateName(formData.name)) isValid = false;
  if (!validateCategory(formData.theme_category_id)) isValid = false;
  if (!validateLink(formData.link)) isValid = false;
  if (!validateThumbnail(formData.thumbnail)) isValid = false;

  return isValid;
};

// File handling
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Clear backend error for thumbnail field
  clearBackendError("thumbnail");

  // Validate file type using regex
  const allowedTypesRegex = /^image\/(jpeg|jpg|png|webp)$/i;
  if (!allowedTypesRegex.test(file.type)) {
    showNotification("error", "Format file harus JPG, PNG, atau WebP");
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showNotification("error", "Ukuran file maksimal 5MB");
    return;
  }

  formData.thumbnail = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    thumbnailPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // Validate after file is set
  if (ui.isFormTouched) {
    validateField("thumbnail", file);
  }
};

const removeThumbnail = () => {
  formData.thumbnail = null;
  thumbnailPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  // Clear backend error for thumbnail field
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
      is_premium: themeData.is_premium || false,
    });

    // Set preview for existing thumbnail
    if (themeData.thumbnail && typeof themeData.thumbnail === "string") {
      thumbnailPreview.value = themeData.thumbnail;
    }
  } catch (error) {
    console.error("Error fetching theme:", error);
    showNotification("error", "Gagal memuat data tema. Silakan coba lagi.");
  } finally {
    ui.isLoading = false;
  }
};

// Form submission - SIMPLIFIED VERSION
const submitForm = async () => {
  ui.isFormTouched = true;

  if (!validateForm()) return;

  ui.isSubmitting = true;
  try {
    // Send raw form data directly to the API functions
    if (isEditMode.value) {
      await updateTheme(props.themeId, formData);
      showNotification("success", "Tema berhasil diperbarui!");
    } else {
      await createTheme(formData);
      showNotification("success", "Tema berhasil ditambahkan!");
      resetForm();
    }

    themesRefresh();
  } catch (error) {
    console.error(
      `Error ${isEditMode.value ? "updating" : "creating"} theme:`,
      error
    );

    // Handle backend validation errors
    if (error?.validationErrors || error?.response?.data?.validationErrors) {
      const backendErrors =
        error.validationErrors || error.response.data.validationErrors;
      setBackendValidationErrors(backendErrors);

      // Show general error message
      const generalMessage =
        error?.message ||
        error?.response?.data?.message ||
        `Gagal ${
          isEditMode.value ? "memperbarui" : "menambahkan"
        } tema. Periksa form dan coba lagi.`;
      showNotification("error", generalMessage);
    } else {
      // Handle other errors
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

const markFormAsTouched = () => {
  ui.isFormTouched = true;
};

// Enhanced input handlers that clear backend errors and trigger real-time validation
const handleNameInput = () => {
  ui.isFormTouched = true;
  clearBackendError("name");
  // Real-time validation with debounce
  clearTimeout(window.nameValidationTimeout);
  window.nameValidationTimeout = setTimeout(() => {
    validateField("name", formData.name);
  }, 300);
};

const handleCategoryChange = () => {
  ui.isFormTouched = true;
  clearBackendError("theme_category_id");
  // Immediate validation for select
  validateField("theme_category_id", formData.theme_category_id);
};

const handleLinkInput = () => {
  ui.isFormTouched = true;
  clearBackendError("link");
  // Real-time validation with debounce
  clearTimeout(window.linkValidationTimeout);
  window.linkValidationTimeout = setTimeout(() => {
    validateField("link", formData.link);
  }, 300);
};

const handlePremiumChange = () => {
  markFormAsTouched();
  clearBackendError("is_premium");
};

// Watchers for real-time validation
watch(
  () => formData.name,
  (newVal) => {
    if (ui.isFormTouched) {
      clearTimeout(window.nameValidationTimeout);
      window.nameValidationTimeout = setTimeout(() => {
        validateField("name", newVal);
      }, 300);
    }
  }
);

watch(
  () => formData.theme_category_id,
  (newVal) => {
    if (ui.isFormTouched) {
      validateField("theme_category_id", newVal);
    }
  }
);

watch(
  () => formData.link,
  (newVal) => {
    if (ui.isFormTouched) {
      clearTimeout(window.linkValidationTimeout);
      window.linkValidationTimeout = setTimeout(() => {
        validateField("link", newVal);
      }, 300);
    }
  }
);

watch(
  () => formData.is_premium,
  (newVal) => {
    if (ui.isFormTouched) {
      // Premium field doesn't need validation, but we keep consistency
      clearBackendError("is_premium");
    }
  }
);

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
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
    <!-- Header -->
    <header class="mb-6">
      <h2
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        <div
          class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
        >
          <i
            :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-lg'"
            class="text-purple-600 dark:text-purple-400"
          />
        </div>
        {{ isEditMode ? "Edit Tema" : "Tambah Tema" }}
      </h2>
    </header>

    <!-- Loading State -->
    <div v-if="ui.isLoading" class="text-center py-8">
      <div
        class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
      >
        <Spinner />
        <p>Memuat data tema...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else>
      <!-- Success Alert -->
      <Transition name="fade">
        <div
          v-if="ui.showSuccess"
          class="w-full rounded-2xl p-6 bg-green-100 dark:bg-green-950 border border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 font-medium mb-6 flex items-center gap-3"
        >
          <i class="bi bi-check-circle-fill text-lg" />
          <p>
            {{
              isEditMode
                ? "Tema berhasil diperbarui!"
                : "Tema berhasil ditambahkan!"
            }}
          </p>
        </div>
      </Transition>

      <!-- Error Alert -->
      <Transition name="fade">
        <div
          v-if="ui.showError"
          class="w-full rounded-2xl p-6 bg-red-100 dark:bg-red-950 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 font-medium mb-6 flex items-center gap-3"
        >
          <i class="bi bi-exclamation-triangle-fill text-lg" />
          <p>{{ ui.errorMessage }}</p>
        </div>
      </Transition>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Theme Name -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nama Tema <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            @input="handleNameInput"
            type="text"
            placeholder="Contoh: Modern Wedding Theme"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
            :class="
              validationErrors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400'
            "
          />
          <Transition name="fade">
            <p
              v-if="validationErrors.name"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle" />
              {{ validationErrors.name }}
            </p>
          </Transition>
        </div>

        <!-- Category and Premium Status -->
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Theme Category -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Kategori Tema <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.theme_category_id"
              @change="handleCategoryChange"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
              :class="
                validationErrors.theme_category_id
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400'
              "
            >
              <option value="">Pilih Kategori</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id.toString()"
              >
                {{ category.name }}
              </option>
            </select>
            <Transition name="fade">
              <p
                v-if="validationErrors.theme_category_id"
                class="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-circle" />
                {{ validationErrors.theme_category_id }}
              </p>
            </Transition>
          </div>

          <!-- Premium Status -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Status Premium
            </label>
            <div
              class="flex items-center justify-center h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl"
            >
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.is_premium"
                  @change="handlePremiumChange"
                  type="checkbox"
                  class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {{ formData.is_premium ? "Premium" : "Gratis" }}
                </span>
                <i
                  :class="
                    formData.is_premium
                      ? 'bi bi-star-fill text-yellow-500'
                      : 'bi bi-star text-gray-400'
                  "
                  class="text-lg"
                />
              </label>
            </div>
            <Transition name="fade">
              <p
                v-if="validationErrors.is_premium"
                class="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-circle" />
                {{ validationErrors.is_premium }}
              </p>
            </Transition>
          </div>
        </div>

        <!-- Theme Link -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Link Tema <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.link"
            @input="handleLinkInput"
            type="url"
            placeholder="https://example.com/theme-demo"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
            :class="
              validationErrors.link
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400'
            "
          />
          <Transition name="fade">
            <p
              v-if="validationErrors.link"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle" />
              {{ validationErrors.link }}
            </p>
          </Transition>
        </div>

        <!-- Thumbnail Upload -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Thumbnail <span class="text-red-500">*</span>
          </label>

          <!-- Upload Area -->
          <div v-if="!thumbnailPreview" class="space-y-4">
            <div
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
              :class="validationErrors.thumbnail ? 'border-red-500' : ''"
              @click="fileInput?.click()"
            >
              <div class="flex flex-col items-center gap-3">
                <i class="bi bi-cloud-upload text-4xl text-gray-400" />
                <div>
                  <p
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Klik untuk upload thumbnail
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: JPG, PNG, WebP (Maks. 5MB)
                  </p>
                </div>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              @change="handleFileChange"
              class="hidden"
            />
          </div>

          <!-- Preview -->
          <div v-else class="relative">
            <div
              class="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
            >
              <img
                :src="thumbnailPreview"
                alt="Thumbnail preview"
                class="w-full aspect-[4/3] object-cover"
              />
            </div>
            <button
              type="button"
              @click="removeThumbnail"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <i class="bi bi-x text-lg" />
            </button>
            <div
              class="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <i class="bi bi-check-circle text-green-500" />
              <span>Thumbnail berhasil diupload</span>
            </div>
          </div>

          <Transition name="fade">
            <p
              v-if="validationErrors.thumbnail"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle" />
              {{ validationErrors.thumbnail }}
            </p>
          </Transition>
        </div>

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
