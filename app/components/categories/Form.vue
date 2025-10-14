<script setup>
const { createThemeCategory, updateThemeCategory, categoriesRefresh } =
  useThemeCategoryStore();

const props = defineProps({
  categoryId: {
    type: [String, Number],
    required: false,
    default: null,
  },
  categoryData: {
    type: Object,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

// Validation patterns
const validationPatterns = {
  name: {
    required: /^.+$/,
    minLength: /^.{3,}$/,
    message: {
      required: "Nama kategori wajib diisi",
      minLength: "Nama kategori minimal 3 karakter",
    },
  },
  description: {
    required: /^.+$/,
    minLength: /^.{5,}$/,
    message: {
      required: "Deskripsi wajib diisi",
      minLength: "Deskripsi minimal 5 karakter",
    },
  },
};

// Use form validation composable
const {
  validationErrors,
  clearBackendError,
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

// Initial form state
const initialFormState = {
  name: "",
  description: "",
};

// Reactive state
const formData = reactive({ ...initialFormState });
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  isFormTouched: false,
});

// Computed
const isEditMode = computed(() => props.categoryId !== null);

const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  return !!(formData.name.trim() && formData.description.trim());
});

// Validation functions
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;

  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;

  if (!validateField("name", formData.name)) isValid = false;
  if (!validateField("description", formData.description)) isValid = false;

  return isValid;
};

// Form handlers
const resetForm = () => {
  Object.assign(formData, { ...initialFormState });
  resetErrors();
  ui.isFormTouched = false;
};

// Enhanced input handlers with debounce
const handleNameInput = () => {
  ui.isFormTouched = true;
  clearBackendError("name");
  clearTimeout(window.nameValidationTimeout);
  window.nameValidationTimeout = setTimeout(() => {
    validateField("name", formData.name);
  }, 300);
};

const handleDescriptionInput = () => {
  ui.isFormTouched = true;
  clearBackendError("description");
  clearTimeout(window.descriptionValidationTimeout);
  window.descriptionValidationTimeout = setTimeout(() => {
    validateField("description", formData.description);
  }, 300);
};

// Close form
const closeForm = () => {
  resetForm();
  emit("close");
};

// Handle submit
const handleSubmit = async () => {
  ui.isFormTouched = true;

  if (!validateForm()) {
    showNotification("warning", "Mohon lengkapi semua field yang wajib diisi.");
    return;
  }

  ui.isSubmitting = true;

  try {
    if (isEditMode.value) {
      await updateThemeCategory(props.categoryId, formData);
      showNotification("success", "Kategori tema berhasil diperbarui!");
    } else {
      await createThemeCategory(formData);
      showNotification("success", "Kategori tema berhasil ditambahkan!");
      resetForm();
    }

    categoriesRefresh();
  } catch (error) {
    console.error("Form submission error:", error);
    showNotification(
      "error",
      isEditMode.value
        ? "Gagal memperbarui kategori. Silakan coba lagi."
        : "Gagal menambahkan kategori. Silakan coba lagi."
    );
  } finally {
    ui.isSubmitting = false;
  }
};

// Watchers
watch(
  () => props.categoryData,
  (newData) => {
    if (newData && isEditMode.value) {
      formData.name = newData.name || "";
      formData.description = newData.description || "";
    }
  },
  { immediate: true }
);

watch(
  () => props.categoryId,
  (newId) => {
    if (newId === null) {
      resetForm();
    }
  }
);

// Lifecycle
onMounted(() => {
  if (isEditMode.value && props.categoryData) {
    formData.name = props.categoryData.name || "";
    formData.description = props.categoryData.description || "";
  }
});
</script>

<template>
  <div>
    <!-- Popup Alert Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <!-- Add/Edit Form -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        class="relative p-8 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
      >
        <!-- Header Form -->
        <header class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
            >
              <i
                :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-lg'"
                class="text-white text-lg"
              />
            </div>
            <div>
              <h3 class="text-lg font-bold text-dark dark:text-white">
                {{ isEditMode ? "Edit Kategori" : "Tambah Kategori Baru" }}
              </h3>
              <p class="text-sm text-dark/60 dark:text-white/60">
                {{
                  isEditMode
                    ? "Ubah informasi kategori tema"
                    : "Buat kategori tema baru untuk undangan Anda"
                }}
              </p>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="closeForm"
            :disabled="ui.isSubmitting"
            class="p-2 hover:bg-dark/10 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close form"
          >
            <i class="bi bi-x-lg text-dark dark:text-white text-lg"></i>
          </button>
        </header>

        <!-- Form Content -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Category Name -->
          <FormBaseInput
            v-model="formData.name"
            label="Nama Kategori"
            placeholder="Contoh: Minimalis Modern"
            :required="true"
            :error="validationErrors.name"
            :disabled="ui.isSubmitting"
            @input="handleNameInput"
          />

          <!-- Description -->
          <div>
            <label
              class="block text-sm font-semibold text-dark dark:text-white mb-2"
            >
              Deskripsi
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.description"
              placeholder="Jelaskan karakteristik kategori tema ini..."
              :disabled="ui.isSubmitting"
              @input="handleDescriptionInput"
              @blur="() => validateField('description', formData.description)"
              rows="4"
              maxlength="500"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl text-dark dark:text-white placeholder-dark/40 dark:placeholder-white/40 resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              :class="
                validationErrors.description
                  ? 'border-red-500 dark:border-red-500/50 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                  : 'border-dark/10 dark:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              "
            ></textarea>

            <!-- Error Message -->
            <p
              v-if="validationErrors.description"
              class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5"
            >
              <i class="bi bi-exclamation-circle"></i>
              {{ validationErrors.description }}
            </p>

            <!-- Character Counter -->
            <p class="mt-2 text-xs text-dark/60 dark:text-white/60">
              {{ formData.description.length }} / 500 karakter
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex gap-4 pt-6 border-t border-dark/10 dark:border-white/10"
          >
            <button
              type="button"
              @click="closeForm"
              :disabled="ui.isSubmitting"
              class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-dark dark:text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!isFormValid || ui.isSubmitting"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span
                v-if="!ui.isSubmitting"
                class="flex items-center justify-center gap-2"
              >
                <i :class="isEditMode ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></i>
                {{ isEditMode ? "Perbarui Kategori" : "Simpan Kategori" }}
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <span
                  class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>
