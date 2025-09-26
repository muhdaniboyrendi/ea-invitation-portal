<script setup>
import { z } from "zod";

// Props
const props = defineProps({
  themeId: {
    type: String,
    required: false,
    default: null,
  },
});

// Composables
const { createTheme, updateTheme, fetchTheme, refresh } = useThemeStore();
const { categories } = storeToRefs(useThemeCategoryStore());

// Validation schema
const themeSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tema wajib diisi")
    .min(3, "Nama tema minimal 3 karakter"),
  theme_category_id: z.string().min(1, "Kategori tema wajib dipilih"),
  link: z
    .string()
    .url("Link harus berupa URL yang valid")
    .min(1, "Link tema wajib diisi"),
  thumbnail: z
    .any()
    .refine(
      (file) => file instanceof File || typeof file === "string",
      "Thumbnail wajib diupload"
    ),
  is_premium: z.boolean(),
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
const validationErrors = ref({});
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
  try {
    const cleanData = getCleanFormData();
    themeSchema.parse(cleanData);
    return Object.keys(validationErrors.value).length === 0;
  } catch {
    return false;
  }
});

// Utility functions
const getCleanFormData = () => ({
  name: formData.name.trim(),
  theme_category_id: formData.theme_category_id,
  link: formData.link.trim(),
  thumbnail: formData.thumbnail,
  is_premium: formData.is_premium,
});

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
  validationErrors.value = {};
  ui.isFormTouched = false;
  ui.errorMessage = "";
  thumbnailPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Clear backend validation errors when user starts typing
const clearBackendError = (field) => {
  if (validationErrors.value[field] && ui.isFormTouched) {
    delete validationErrors.value[field];
  }
};

// Set backend validation errors
const setBackendValidationErrors = (backendErrors) => {
  if (!backendErrors || typeof backendErrors !== "object") return;

  // Clear existing validation errors first
  validationErrors.value = {};

  // Set backend validation errors
  Object.keys(backendErrors).forEach((field) => {
    if (backendErrors[field]) {
      // Handle array of errors or single error
      if (Array.isArray(backendErrors[field])) {
        validationErrors.value[field] = backendErrors[field][0];
      } else {
        validationErrors.value[field] = backendErrors[field];
      }
    }
  });
};

// Validation
const validateField = (field, value) => {
  // Skip frontend validation if there's a backend error for this field
  // Backend errors should only be cleared when user interacts with the field
  if (validationErrors.value[field]) {
    return;
  }

  try {
    const testData = { ...getCleanFormData(), [field]: value };
    themeSchema.pick({ [field]: true }).parse({ [field]: testData[field] });
    delete validationErrors.value[field];
  } catch (error) {
    if (error.errors?.length > 0) {
      validationErrors.value[field] = error.errors[0].message;
    }
  }
};

const validateForm = () => {
  try {
    const cleanData = getCleanFormData();
    themeSchema.parse(cleanData);
    // Only clear frontend validation errors, keep backend errors
    const backendErrors = {};
    Object.keys(validationErrors.value).forEach((field) => {
      // Keep errors that don't match our frontend validation messages
      const frontendMessages = [
        "Nama tema wajib diisi",
        "Nama tema minimal 3 karakter",
        "Kategori tema wajib dipilih",
        "Link harus berupa URL yang valid",
        "Link tema wajib diisi",
        "Thumbnail wajib diupload",
      ];

      if (!frontendMessages.includes(validationErrors.value[field])) {
        backendErrors[field] = validationErrors.value[field];
      }
    });
    validationErrors.value = backendErrors;
    return true;
  } catch (error) {
    const frontendErrors = {};
    error.errors?.forEach((err) => {
      frontendErrors[err.path[0]] = err.message;
    });

    // Merge with existing backend errors
    validationErrors.value = { ...validationErrors.value, ...frontendErrors };
    return false;
  }
};

// File handling
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Clear backend error for thumbnail field
  clearBackendError("thumbnail");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
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

// Form submission
const submitForm = async () => {
  ui.isFormTouched = true;

  if (!validateForm()) return;

  ui.isSubmitting = true;
  try {
    const themeData = getCleanFormData();

    // Convert to FormData for file upload
    const formDataToSend = new FormData();
    Object.keys(themeData).forEach((key) => {
      if (key === "thumbnail" && themeData[key] instanceof File) {
        formDataToSend.append(key, themeData[key]);
      } else if (key === "is_premium") {
        formDataToSend.append(key, themeData[key] ? "1" : "0");
      } else if (themeData[key] !== null) {
        formDataToSend.append(key, themeData[key]);
      }
    });

    if (isEditMode.value) {
      await updateTheme(props.themeId, formDataToSend);
      showNotification("success", "Tema berhasil diperbarui!");
    } else {
      await createTheme(formDataToSend);
      showNotification("success", "Tema berhasil ditambahkan!");
      resetForm();
    }

    refresh();
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

// Enhanced input handlers that clear backend errors
const handleNameInput = () => {
  markFormAsTouched();
  clearBackendError("name");
};

const handleCategoryChange = () => {
  markFormAsTouched();
  clearBackendError("theme_category_id");
};

const handleLinkInput = () => {
  markFormAsTouched();
  clearBackendError("link");
};

const handlePremiumChange = () => {
  markFormAsTouched();
  clearBackendError("is_premium");
};

// Watchers
watch(
  () => formData.name,
  (newVal) => {
    if (ui.isFormTouched) validateField("name", newVal.trim());
  }
);

watch(
  () => formData.theme_category_id,
  (newVal) => {
    if (ui.isFormTouched) validateField("theme_category_id", newVal);
  }
);

watch(
  () => formData.link,
  (newVal) => {
    if (ui.isFormTouched) validateField("link", newVal.trim());
  }
);

watch(
  () => formData.is_premium,
  (newVal) => {
    if (ui.isFormTouched) validateField("is_premium", newVal);
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
