<!-- UserInvitationDetailGuestForm -->
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

const emit = defineEmits(["success", "error", "cancel"]);

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
        is_group: Boolean(newGuest.is_group),
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
    class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6 mb-4 md:mb-6"
  >
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
      >
        <i
          :class="isEditMode ? 'bi-pencil-square' : 'bi-person-plus-fill'"
          class="bi text-sky-500 text-lg"
        ></i>
      </div>
      <div class="flex-1 min-w-0">
        <h3
          class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
        >
          {{ isEditMode ? "Edit Tamu" : "Tambah Tamu Baru" }}
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          {{
            isEditMode ? "Perbarui informasi tamu" : "Isi data tamu undangan"
          }}
        </p>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Name Input -->
      <FormBaseInput
        v-model="formData.name"
        type="text"
        label="Nama Tamu"
        placeholder="contoh: John Doe"
        :required="true"
        :error="validationErrors.name"
        @input="handleInput('name', formData.name)"
      />

      <!-- Phone Input -->
      <FormBaseInput
        v-model="formData.phone"
        type="tel"
        label="Nomor Telepon"
        placeholder="contoh: 08**********"
        :error="validationErrors.phone"
        @input="handleInput('phone', formData.phone)"
      >
        <template #label-suffix>
          <span class="text-xs text-slate-400 font-normal ml-1"
            >(Opsional)</span
          >
        </template>
      </FormBaseInput>

      <!-- Group Checkbox Card -->
      <label
        for="is_group"
        class="block p-4 rounded-2xl border-2 transition-all cursor-pointer"
        :class="
          formData.is_group
            ? 'bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        "
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <i
                class="bi bi-people-fill text-lg"
                :class="
                  formData.is_group
                    ? 'text-sky-500'
                    : 'text-slate-600 dark:text-slate-400'
                "
              ></i>
              <span
                class="text-sm font-semibold"
                :class="
                  formData.is_group
                    ? 'text-slate-900 dark:text-slate-50'
                    : 'text-slate-900 dark:text-slate-50'
                "
              >
                Tamu Grup / Keluarga
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 ml-7">
              Tandai jika ini adalah grup/keluarga (otomatis hadir)
            </p>
          </div>

          <!-- Custom Checkbox -->
          <div class="relative ml-4 flex-shrink-0">
            <input
              v-model="formData.is_group"
              type="checkbox"
              id="is_group"
              class="sr-only peer"
            />
            <div
              class="w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center"
              :class="
                formData.is_group
                  ? 'bg-sky-500 border-sky-500'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              "
            >
              <i
                v-if="formData.is_group"
                class="bi bi-check-lg text-white text-lg font-bold"
              ></i>
            </div>
          </div>
        </div>
      </label>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button
          type="button"
          @click="handleCancel"
          :disabled="ui.isSubmitting"
          class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
        >
          <i class="bi bi-x-lg text-lg"></i>
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
