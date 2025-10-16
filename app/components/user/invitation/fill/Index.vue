<script setup>
const route = useRoute();
const invitationId = route.params.invitationId;

// Store composables
const { fetchMainInfo, createMainInfo, updateMainInfo } = useMainInfoStore();
const { musics } = storeToRefs(useMusicStore());

// Timezone options
const timezoneOptions = [
  { id: "WIB", name: "WIB (Waktu Indonesia Barat)" },
  { id: "WITA", name: "WITA (Waktu Indonesia Tengah)" },
  { id: "WIT", name: "WIT (Waktu Indonesia Timur)" },
];

// Validation patterns
const validationPatterns = {
  invitation_id: {
    required: /^.+$/,
    message: {
      required: "ID Undangan wajib ada",
    },
  },
  wedding_date: {
    required: /^.+$/,
    message: {
      required: "Tanggal pernikahan wajib diisi",
    },
  },
  wedding_time: {
    required: /^.+$/,
    time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    message: {
      required: "Waktu pernikahan wajib diisi",
      time: "Format waktu harus HH:MM (contoh: 14:30)",
    },
  },
  time_zone: {
    required: /^.+$/,
    message: {
      required: "Zona waktu wajib dipilih",
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

// File upload for main_photo
const {
  fileInput: mainPhotoInput,
  preview: mainPhotoPreview,
  isUpdated: isMainPhotoUpdated,
  handleFileChange: handleMainPhotoUpload,
  removeFile: removeMainPhoto,
  reset: resetMainPhotoUpload,
  setPreview: setMainPhotoPreview,
} = useFileUpload({
  allowedTypes: /^image\/(jpeg|jpg|png|webp)$/i,
  maxSize: 5 * 1024 * 1024,
  onSuccess: (file) => {
    formData.main_photo = file;
    clearBackendError("main_photo");
    if (ui.isFormTouched) {
      validateField("main_photo", file);
    }
  },
  onError: (message) => {
    showNotification("error", message);
  },
});

// File upload for custom_backsound
const {
  fileInput: customBacksoundInput,
  preview: customBacksoundPreview,
  isUpdated: isCustomBacksoundUpdated,
  handleFileChange: handleCustomBacksoundUpload,
  removeFile: removeCustomBacksound,
  reset: resetCustomBacksoundUpload,
  setPreview: setCustomBacksoundPreview,
} = useFileUpload({
  allowedTypes: /^audio\/(mpeg|mp3|wav|ogg)$/i,
  maxSize: 10 * 1024 * 1024,
  onSuccess: (file) => {
    formData.custom_backsound = file;
    // Clear backsound_id when custom backsound is uploaded
    formData.backsound_id = "";
    clearBackendError("custom_backsound");
    if (ui.isFormTouched) {
      validateField("custom_backsound", file);
    }
  },
  onError: (message) => {
    showNotification("error", message);
  },
});

// Initial form state
const initialFormState = {
  id: null,
  invitation_id: invitationId || "",
  backsound_id: "",
  main_photo: null,
  wedding_date: "",
  wedding_time: "",
  time_zone: "WIB",
  custom_backsound: null,
};

// Reactive state
const formData = reactive({ ...initialFormState });
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  isFormTouched: false,
});

// Timers for debouncing
const weddingTimeTimeout = ref(null);

// Computed
const isEditMode = computed(() => (formData.id ? true : false)); // Set to true if editing
const isFormValid = computed(() => {
  return (
    Object.keys(validationErrors.value).length === 0 &&
    formData.invitation_id &&
    formData.wedding_date &&
    formData.wedding_time &&
    formData.time_zone
  );
});

const hasBacksoundSelected = computed(() => {
  return !!(formData.backsound_id || formData.custom_backsound);
});

// Validation functions
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;

  if (field === "main_photo" || field === "custom_backsound") {
    if (!value || (!(value instanceof File) && typeof value !== "string")) {
      return true; // Optional fields
    }
    return true;
  }

  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;

  if (!validateField("invitation_id", formData.invitation_id)) isValid = false;
  if (!validateField("wedding_date", formData.wedding_date)) isValid = false;
  if (!validateField("wedding_time", formData.wedding_time)) isValid = false;
  if (!validateField("time_zone", formData.time_zone)) isValid = false;

  return isValid;
};

// Form handlers
const resetForm = () => {
  Object.assign(formData, {
    ...initialFormState,
    invitation_id: invitationId || "",
  });
  resetErrors();
  resetMainPhotoUpload();
  resetCustomBacksoundUpload();
  ui.isFormTouched = false;
};

// Input handlers
const handleBacksoundChange = () => {
  ui.isFormTouched = true;
  clearBackendError("backsound_id");
  // Clear custom backsound when selecting from library
  if (formData.backsound_id) {
    formData.custom_backsound = null;
    removeCustomBacksound();
  }
};

const handleWeddingDateChange = () => {
  ui.isFormTouched = true;
  clearBackendError("wedding_date");
  validateField("wedding_date", formData.wedding_date);
};

const handleWeddingTimeInput = () => {
  ui.isFormTouched = true;
  clearBackendError("wedding_time");
  clearTimeout(weddingTimeTimeout.value);
  weddingTimeTimeout.value = setTimeout(() => {
    validateField("wedding_time", formData.wedding_time);
  }, 300);
};

const handleTimeZoneChange = () => {
  ui.isFormTouched = true;
  clearBackendError("time_zone");
  validateField("time_zone", formData.time_zone);
};

const handleMainPhotoChange = (event) => {
  const file = handleMainPhotoUpload(event);
  if (file) {
    formData.main_photo = file;
  }
};

const handleMainPhotoRemove = () => {
  removeMainPhoto();
  formData.main_photo = null;
  clearBackendError("main_photo");
};

const handleCustomBacksoundChange = (event) => {
  const file = handleCustomBacksoundUpload(event);
  if (file) {
    formData.custom_backsound = file;
  }
};

const handleCustomBacksoundRemove = () => {
  removeCustomBacksound();
  formData.custom_backsound = null;
  clearBackendError("custom_backsound");
};

// Data fetching
const fetchMainInfoData = async () => {
  if (!invitationId) return;

  ui.isLoading = true;
  try {
    const weddingData = await fetchMainInfo(invitationId);

    Object.assign(formData, {
      id: weddingData.id?.toString() || "",
      backsound_id: weddingData.backsound_id?.toString() || "",
      main_photo: weddingData.main_photo || null,
      wedding_date: weddingData.wedding_date || "",
      wedding_time: weddingData.wedding_time || "",
      time_zone: weddingData.time_zone || "WIB",
      custom_backsound: weddingData.custom_backsound || null,
    });

    if (weddingData.main_photo && typeof weddingData.main_photo === "string") {
      setMainPhotoPreview(weddingData.main_photo_url);
    }

    if (
      weddingData.custom_backsound &&
      typeof weddingData.custom_backsound === "string"
    ) {
      setCustomBacksoundPreview(weddingData.custom_backsound_url);
    }
  } catch (error) {
    console.error("Error fetching wedding details:", error);
    showNotification(
      "error",
      "Gagal memuat data pernikahan. Silakan coba lagi."
    );
  } finally {
    ui.isLoading = false;
  }
};

// Error handler
const handleSubmitError = (error) => {
  console.error(
    `Error ${isEditMode.value ? "updating" : "creating"} wedding details:`,
    error
  );

  const backendErrors =
    error?.validationErrors || error?.response?.data?.validationErrors;

  if (backendErrors) {
    setBackendValidationErrors(backendErrors);
  }

  const message =
    error?.message ||
    error?.response?.data?.message ||
    `Gagal ${
      isEditMode.value ? "memperbarui" : "menyimpan"
    } data pernikahan. Silakan coba lagi.`;

  showNotification("error", message);
};

// Form submission
const submitForm = async () => {
  if (ui.isSubmitting) return; // Prevent double submit

  ui.isFormTouched = true;

  if (!validateForm()) {
    showNotification("warning", "Mohon lengkapi semua field yang wajib diisi.");
    return;
  }

  ui.isSubmitting = true;
  try {
    const dataToSubmit = { ...formData };

    // Handle main_photo
    if (isEditMode.value && !isMainPhotoUpdated.value) {
      dataToSubmit.main_photo = null;
    }

    // Handle custom_backsound
    if (isEditMode.value && !isCustomBacksoundUpdated.value) {
      dataToSubmit.custom_backsound = null;
    }

    if (isEditMode.value) {
      await updateMainInfo(invitationId, dataToSubmit);
      showNotification("success", "Data pernikahan berhasil diperbarui!");
    } else {
      await createMainInfo(dataToSubmit);
      showNotification("success", "Data pernikahan berhasil disimpan!");
    }
  } catch (error) {
    handleSubmitError(error);
  } finally {
    ui.isSubmitting = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchMainInfoData();
});

onBeforeUnmount(() => {
  clearTimeout(weddingTimeTimeout.value);
});
</script>

<template>
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
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
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        <div
          class="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center"
        >
          <i class="bi bi-heart-fill text-pink-600 dark:text-pink-400" />
        </div>
        {{ isEditMode ? "Edit Data Pernikahan" : "Tambah Data Pernikahan" }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        ID Undangan: <span class="font-semibold">{{ invitationId }}</span>
      </p>
    </header>

    <!-- Loading State -->
    <div v-if="ui.isLoading" class="text-center py-8">
      <div
        class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
      >
        <Spinner />
        <p>Memuat data pernikahan...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else>
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Wedding Date & Time -->
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Wedding Date -->
          <FormBaseInput
            v-model="formData.wedding_date"
            type="date"
            label="Tanggal Pernikahan"
            :required="true"
            :error="validationErrors.wedding_date"
            @change="handleWeddingDateChange"
          />

          <!-- Wedding Time -->
          <FormBaseInput
            v-model="formData.wedding_time"
            type="time"
            label="Waktu Pernikahan"
            placeholder="14:30"
            :required="true"
            :error="validationErrors.wedding_time"
            @input="handleWeddingTimeInput"
          />
        </div>

        <!-- Time Zone -->
        <FormBaseSelect
          v-model="formData.time_zone"
          label="Zona Waktu"
          placeholder="Pilih Zona Waktu"
          :options="timezoneOptions"
          :required="true"
          :error="validationErrors.time_zone"
          @change="handleTimeZoneChange"
        />

        <!-- Main Photo Upload -->
        <FormImageUpload
          ref="mainPhotoInput"
          label="Foto Utama"
          :required="false"
          :preview="mainPhotoPreview"
          :error="validationErrors.main_photo"
          @change="handleMainPhotoChange"
          @remove="handleMainPhotoRemove"
        >
          <template #description>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Foto utama akan ditampilkan sebagai banner undangan (Opsional)
            </p>
          </template>
        </FormImageUpload>

        <!-- Divider -->
        <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <!-- Backsound Section -->
        <div class="space-y-4">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <i
              class="bi bi-music-note-beamed text-purple-600 dark:text-purple-400"
            ></i>
            Backsound (Opsional)
          </h3>

          <!-- Backsound Library -->
          <FormBaseSelect
            v-model="formData.backsound_id"
            label="Pilih dari Library"
            placeholder="Pilih Musik"
            :options="musics"
            :required="false"
            :error="validationErrors.backsound_id"
            :disabled="!!formData.custom_backsound"
            @change="handleBacksoundChange"
          >
            <template #description>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{
                  formData.custom_backsound
                    ? "Hapus backsound kustom untuk memilih dari library"
                    : "Atau upload backsound kustom di bawah"
                }}
              </p>
            </template>
          </FormBaseSelect>

          <!-- Custom Backsound Upload -->
          <FormAudioUpload
            ref="customBacksoundInput"
            label="Upload Backsound Kustom"
            accept="audio/*"
            :required="false"
            :preview="customBacksoundPreview"
            :error="validationErrors.custom_backsound"
            :disabled="!!formData.backsound_id"
            @change="handleCustomBacksoundChange"
            @remove="handleCustomBacksoundRemove"
          >
            <template #description>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: MP3, WAV, OGG | Maksimal: 10MB
                {{
                  formData.backsound_id
                    ? " | Kosongkan pilihan library untuk upload kustom"
                    : ""
                }}
              </p>
            </template>
          </FormAudioUpload>

          <!-- Backsound Status Indicator -->
          <div
            v-if="hasBacksoundSelected"
            class="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <i
              class="bi bi-check-circle-fill text-green-600 dark:text-green-400"
            ></i>
            <span class="text-sm text-green-700 dark:text-green-300">
              {{
                formData.custom_backsound
                  ? "Backsound kustom dipilih"
                  : "Backsound dari library dipilih"
              }}
            </span>
          </div>
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
            :aria-busy="ui.isSubmitting"
            :aria-label="
              isEditMode
                ? 'Perbarui data pernikahan'
                : 'Simpan data pernikahan baru'
            "
            class="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
  </div>
</template>
