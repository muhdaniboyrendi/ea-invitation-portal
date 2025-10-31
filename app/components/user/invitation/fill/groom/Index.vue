<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next", "step-status"]);

const { fetchGroom, createGroom, updateGroom } = useGroomStore();

const validationPatterns = {
  full_name: {
    required: /^.+$/,
    message: { required: "Nama lengkap wajib diisi" },
  },
  father: {
    required: /^.+$/,
    message: { required: "Nama ayah wajib diisi" },
  },
  mother: {
    required: /^.+$/,
    message: { required: "Nama ibu wajib diisi" },
  },
  instagram: {
    pattern: /^[a-zA-Z0-9._]*$/,
    message: {
      pattern: "Hanya boleh berisi huruf, angka, titik, dan underscore",
    },
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

// File Upload for Groom's Photo
const {
  fileInput: groomPhotoInput,
  preview: groomPhotoPreview,
  isUpdated: isGroomPhotoUpdated,
  handleFileChange: handleGroomPhotoUpload,
  removeFile: removeGroomPhoto,
  reset: resetGroomPhotoUpload,
  setPreview: setGroomPhotoPreview,
} = useFileUpload({
  allowedTypes: /^image\/(jpeg|jpg|png|webp)$/i,
  maxSize: 5 * 1024 * 1024,
  onSuccess: (file) => {
    formData.photo = file;
    clearBackendError("photo");
  },
  onError: (message) => emit("error", message),
});

// Reactive form data object
const formData = reactive({
  id: null,
  invitation_id: props.invitationId,
  full_name: "",
  father: "",
  mother: "",
  instagram: "",
  photo: null,
});

const ui = reactive({
  isLoading: true,
  isSubmitting: false,
});

// Computed Properties
const isEditMode = computed(() => !!formData.id);

const isFormValid = computed(() => {
  return (
    Object.keys(validationErrors.value).length === 0 &&
    formData.full_name &&
    formData.father &&
    formData.mother
  );
});

watch(
  isEditMode,
  (newValue) => {
    emit("step-status", newValue);
  },
  { immediate: true }
);

// Validation Methods
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;
  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;
  if (!validateField("full_name", formData.full_name)) isValid = false;
  if (!validateField("father", formData.father)) isValid = false;
  if (!validateField("mother", formData.mother)) isValid = false;
  if (formData.instagram) {
    if (!validateField("instagram", formData.instagram)) isValid = false;
  }
  return isValid;
};

// Input Handlers
const handleInput = (field, value) => {
  clearBackendError(field);
  validateField(field, value);
};

// API Calls
const fetchData = async () => {
  ui.isLoading = true;
  try {
    const response = await fetchGroom(props.invitationId);

    Object.assign(formData, {
      id: response.id?.toString() || null,
      full_name: response.full_name || "",
      father: response.father || "",
      mother: response.mother || "",
      instagram: response.instagram || "",
      photo: response.photo || null,
    });

    if (response.photo_url) {
      setGroomPhotoPreview(response.photo_url);
    }
  } catch (error) {
    console.error("Failed to fetch groom data:", error);
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

    if (isEditMode.value && !isGroomPhotoUpdated.value) {
      dataToSubmit.photo = null;
    }

    if (isEditMode.value) {
      await updateGroom(formData.id, dataToSubmit);
      emit("success", "Data mempelai pria berhasil diperbarui!");
    } else {
      await createGroom(dataToSubmit);
      emit("success", "Data mempelai pria berhasil disimpan!");
    }

    emit("step-status", true);

    setTimeout(() => {
      emit("next");
    }, 3000);
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

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    invitation_id: props.invitationId,
    full_name: "",
    father: "",
    mother: "",
    instagram: "",
    photo: null,
  });

  resetErrors();
  resetGroomPhotoUpload();
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
        Memuat data mempelai pria...
      </p>
    </div>
  </div>

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Header Card -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
        >
          <i class="bi bi-person text-sky-500 text-lg"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h2
            class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
          >
            {{ isEditMode ? "Edit Data Mempelai Pria" : "Data Mempelai Pria" }}
          </h2>
          <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            ID: <span class="font-medium">{{ invitationId }}</span>
          </p>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-4 md:space-y-6">
      <!-- Personal Information Section -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
      >
        <div class="flex items-center gap-2 mb-1 md:mb-4">
          <div
            class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
          >
            <i class="bi bi-person-badge text-sky-500"></i>
          </div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Informasi Pribadi
          </h3>
        </div>

        <FormBaseInput
          v-model="formData.full_name"
          type="text"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap mempelai pria"
          :required="true"
          :error="validationErrors.full_name"
          @input="handleInput('full_name', formData.full_name)"
        />

        <FormBaseInput
          v-model="formData.instagram"
          type="text"
          label="Instagram"
          placeholder="contoh: budi_sanjaya"
          :error="validationErrors.instagram"
          @input="handleInput('instagram', formData.instagram)"
        >
          <template #hint>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              Opsional - Tanpa tanda @
            </span>
          </template>
        </FormBaseInput>
      </div>

      <!-- Parents Information Section -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
      >
        <div class="flex items-center gap-2 mb-1 md:mb-4">
          <div
            class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
          >
            <i class="bi bi-people text-sky-500"></i>
          </div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Orang Tua
          </h3>
        </div>

        <FormBaseInput
          v-model="formData.father"
          type="text"
          label="Nama Ayah"
          placeholder="Masukkan nama ayah"
          :required="true"
          :error="validationErrors.father"
          @input="handleInput('father', formData.father)"
        />

        <FormBaseInput
          v-model="formData.mother"
          type="text"
          label="Nama Ibu"
          placeholder="Masukkan nama ibu"
          :required="true"
          :error="validationErrors.mother"
          @input="handleInput('mother', formData.mother)"
        />
      </div>

      <!-- Photo Upload Section -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
      >
        <div class="flex items-center gap-2 mb-3 md:mb-4">
          <div
            class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
          >
            <i class="bi bi-image text-sky-500"></i>
          </div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Foto Mempelai
            <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
          </h3>
        </div>

        <FormImageUpload
          ref="groomPhotoInput"
          label="Foto Mempelai Pria (Opsional)"
          :preview="groomPhotoPreview"
          :error="validationErrors.photo"
          @change="
            (e) => {
              const file = handleGroomPhotoUpload(e);
              if (file) formData.photo = file;
            }
          "
          @remove="
            () => {
              removeGroomPhoto();
              formData.photo = null;
              clearBackendError('photo');
            }
          "
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          type="button"
          @click="resetForm"
          :disabled="ui.isSubmitting"
          class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center font-medium"
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
</template>
