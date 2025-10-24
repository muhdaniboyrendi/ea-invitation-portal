<script setup>
const props = defineProps({
  invitationId: {
    type: [String, Number],
    required: true,
  },
  editingGuest: {
    type: Object,
    default: null,
  },
  showForm: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["success", "error", "cancel", "update:showForm"]);

const { createGuest, updateGuest } = useGuestStore();

const validationPatterns = {
  name: {
    required: /^.+$/,
    message: { required: "Nama tamu wajib diisi" },
  },
  phone: {
    pattern: /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{7,15}$/,
    message: { pattern: "Format nomor telepon tidak valid" },
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

// Reactive form data object
const formData = reactive({
  id: null,
  invitation_id: props.invitationId,
  name: "",
  phone: "",
  is_group: false,
});

const ui = reactive({
  isSubmitting: false,
});

// Computed Properties
const isEditMode = computed(() => !!props.editingGuest);

const isFormValid = computed(() => {
  return Object.keys(validationErrors.value).length === 0 && formData.name;
});

// Validation Methods
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;
  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;
  if (!validateField("name", formData.name)) isValid = false;

  // Optional fields validation
  if (formData.phone && !validateField("phone", formData.phone))
    isValid = false;

  return isValid;
};

// Input Handlers
const handleInput = (field, value) => {
  clearBackendError(field);
  validateField(field, value);
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

    if (isEditMode.value) {
      await updateGuest(props.editingGuest.id, dataToSubmit);
      emit("success", "Data tamu berhasil diperbarui!");
    } else {
      await createGuest(dataToSubmit);
      emit("success", "Data tamu berhasil ditambahkan!");
    }

    resetForm();
    emit("update:showForm", false);
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
    name: "",
    phone: "",
    is_group: false,
  });

  resetErrors();
};

const handleCancel = () => {
  resetForm();
  emit("cancel");
  emit("update:showForm", false);
};

// Watch for editing guest changes
watch(
  () => props.editingGuest,
  (newGuest) => {
    if (newGuest) {
      Object.assign(formData, {
        id: newGuest.id,
        invitation_id: props.invitationId,
        name: newGuest.name || "",
        phone: newGuest.phone || "",
        is_group: newGuest.is_group || false,
      });
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Reset form when showForm becomes false
watch(
  () => props.showForm,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);
</script>

<template>
  <div
    v-if="showForm"
    class="mb-8 p-6 md:p-8 bg-off-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
  >
    <div class="mb-6 flex items-center gap-4">
      <div
        class="h-12 aspect-square rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 text-white flex justify-center items-center"
      >
        <i class="bi bi-person-plus-fill text-2xl"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ isEditMode ? "Edit Tamu" : "Tambah Tamu Baru" }}
      </h3>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <FormBaseInput
        v-model="formData.name"
        type="text"
        label="Nama Tamu"
        placeholder="contoh: Budi Santoso"
        :required="true"
        :error="validationErrors.name"
        @input="handleInput('name', formData.name)"
      />

      <FormBaseInput
        v-model="formData.phone"
        type="tel"
        label="Nomor Telepon (Opsional)"
        placeholder="contoh: 08123456789"
        :error="validationErrors.phone"
        @input="handleInput('phone', formData.phone)"
      />

      <div class="flex items-center gap-3">
        <input
          v-model="formData.is_group"
          type="checkbox"
          id="is_group"
          class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="is_group"
          class="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Tamu Grup / Keluarga (otomatis hadir)
        </label>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

      <div class="flex gap-4">
        <button
          type="button"
          @click="handleCancel"
          :disabled="ui.isSubmitting"
          class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-700 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="ui.isSubmitting || !isFormValid"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          <span v-if="!ui.isSubmitting">
            {{ isEditMode ? "Perbarui Tamu" : "Simpan Tamu" }}
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
