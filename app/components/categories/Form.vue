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

const emit = defineEmits(["close"]);

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

const isEditMode = computed(() => props.categoryId !== null);

const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  return !!(formData.name.trim() && formData.description.trim());
});

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

const closeForm = () => {
  resetForm();
  emit("close");
};

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

onMounted(() => {
  if (isEditMode.value && props.categoryData) {
    formData.name = props.categoryData.name || "";
    formData.description = props.categoryData.description || "";
  }
});
</script>

<template>
  <div class="px-4 md:px-6">
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
        class="relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/10 dark:border-slate-800/10 shadow-xl"
      >
        <!-- Header Form -->
        <header class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center"
            >
              <i
                :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-lg'"
                class="text-white text-lg"
              />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">
                {{ isEditMode ? "Edit Kategori" : "Tambah Kategori Baru" }}
              </h3>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="closeForm"
            :disabled="ui.isSubmitting"
            class="h-8 aspect-square bg-red-50 dark:bg-red-950/70 hover:bg-red-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Close form"
          >
            <i
              class="bi bi-x-lg text-red-500 dark:text-red-400 text-lg group-hover:text-white"
            ></i>
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
              class="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2"
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
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              :class="
                validationErrors.description
                  ? 'border-red-500 dark:border-red-500/50 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
              "
            ></textarea>

            <!-- Error Message -->
            <p
              v-if="validationErrors.description"
              class="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5"
            >
              <i class="bi bi-exclamation-circle"></i>
              {{ validationErrors.description }}
            </p>

            <!-- Character Counter -->
            <p class="mt-2 text-xs text-slate-600 dark:text-slate-300">
              {{ formData.description.length }} / 500 karakter
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex gap-4 pt-6 border-t border-slate-200/10 dark:border-slate-800/10"
          >
            <button
              type="button"
              @click="closeForm"
              :disabled="ui.isSubmitting"
              class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!isFormValid || ui.isSubmitting"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
