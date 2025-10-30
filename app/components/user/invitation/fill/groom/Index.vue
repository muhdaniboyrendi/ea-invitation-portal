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
  <div v-if="ui.isLoading" class="text-center py-8">
    <div
      class="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>
      <p>Memuat data mempelai pria...</p>
    </div>
  </div>

  <div v-else>
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
    >
      <h2
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        {{
          isEditMode ? "Edit Data Mempelai Pria" : "Tambah Data Mempelai Pria"
        }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        ID Undangan: <span class="font-semibold">{{ invitationId }}</span>
      </p>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <FormBaseInput
        v-model="formData.full_name"
        type="text"
        label="Nama Lengkap Mempelai Pria"
        :required="true"
        :error="validationErrors.full_name"
        @input="handleInput('full_name', formData.full_name)"
      />

      <FormBaseInput
        v-model="formData.father"
        type="text"
        label="Nama Ayah"
        :required="true"
        :error="validationErrors.father"
        @input="handleInput('father', formData.father)"
      />

      <FormBaseInput
        v-model="formData.mother"
        type="text"
        label="Nama Ibu"
        :required="true"
        :error="validationErrors.mother"
        @input="handleInput('mother', formData.mother)"
      />

      <FormBaseInput
        v-model="formData.instagram"
        type="text"
        label="Instagram (Opsional)"
        placeholder="contoh: budi_sanjaya"
        :error="validationErrors.instagram"
        @input="handleInput('instagram', formData.instagram)"
      />

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

      <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

      <div class="flex gap-4 pt-6">
        <button
          type="button"
          @click="resetForm"
          :disabled="ui.isSubmitting"
          class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="ui.isSubmitting || !isFormValid"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          <span v-if="!ui.isSubmitting">
            {{ isEditMode ? "Perbarui Data" : "Simpan Data" }}
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <Spinner />
            {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
