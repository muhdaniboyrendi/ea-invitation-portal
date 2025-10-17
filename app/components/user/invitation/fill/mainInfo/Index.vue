<script setup>
// Props
const props = defineProps({
  invitationId: {
    type: String,
    required: true,
  },
  packageId: {
    type: [Number, String],
    required: true,
  },
});

// Emits
const emit = defineEmits(["success", "error"]);

// Store composables
const { fetchMainInfo, createMainInfo, updateMainInfo } = useMainInfoStore();
const { musics } = storeToRefs(useMusicStore());

// Audio player state
const audioPlayer = ref(null);

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
    emit("error", message);
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
    // Clear music_id when custom backsound is uploaded
    formData.music_id = "";
    clearBackendError("custom_backsound");
    if (ui.isFormTouched) {
      validateField("custom_backsound", file);
    }
  },
  onError: (message) => {
    emit("error", message);
  },
});

// Initial form state
const initialFormState = {
  id: null,
  invitation_id: props.invitationId || "",
  music_id: "",
  main_photo: null,
  wedding_date: "",
  wedding_time: "",
  time_zone: "WIB",
  custom_backsound: null,
};

// Reactive state
const formData = reactive({ ...initialFormState });
const ui = reactive({
  isLoading: true,
  isSubmitting: false,
  isFormTouched: false,
  currentPlayingId: null,
  isAudioLoading: false,
});

// Timers for debouncing
const weddingTimeTimeout = ref(null);

// Computed
const isEditMode = computed(() => (formData.id ? true : false));

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
  return !!(formData.music_id || formData.custom_backsound);
});

// Perbaikan: Computed untuk selected music dari musik yang ada di store
const selectedMusic = computed(() => {
  if (!formData.music_id) return null;
  return musics.value.find(
    (m) => m.id === formData.music_id || m.id === parseInt(formData.music_id)
  );
});

// Check if music is currently playing
const isPlaying = (musicId) => {
  return ui.currentPlayingId === musicId;
};

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
    invitation_id: props.invitationId || "",
  });
  resetErrors();
  resetMainPhotoUpload();
  resetCustomBacksoundUpload();
  ui.isFormTouched = false;

  // Stop playing music
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
  ui.currentPlayingId = null;
};

// Music player handlers
const playMusic = async (music) => {
  try {
    // Stop current playing music if any
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0;
    }

    // Create new audio instance
    audioPlayer.value = new Audio(music.audio_url);

    // Handle when music ends
    audioPlayer.value.addEventListener("ended", () => {
      ui.currentPlayingId = null;
    });

    // Handle errors
    audioPlayer.value.addEventListener("error", (e) => {
      emit("error", "Gagal memutar musik. File tidak ditemukan.");
      ui.currentPlayingId = null;
    });

    // Play new music
    ui.isAudioLoading = true;
    await audioPlayer.value.play();
    ui.currentPlayingId = music.id;
  } catch (error) {
    console.error("Error playing music:", error);
    emit("error", "Gagal memutar musik. Silakan coba lagi.");
    ui.currentPlayingId = null;
  } finally {
    ui.isAudioLoading = false;
  }
};

const pauseMusic = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    ui.currentPlayingId = null;
  }
};

// Input handlers
const handleMusicSelect = (music) => {
  ui.isFormTouched = true;
  formData.music_id = music.id;
  // Clear custom backsound when selecting from library
  formData.custom_backsound = null;
  removeCustomBacksound();
  clearBackendError("music_id");
};

const handleMusicPlay = (music) => {
  if (isPlaying(music.id)) {
    pauseMusic();
  } else {
    playMusic(music);
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

const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  // Jika format datetime (YYYY-MM-DD HH:MM:SS), ambil bagian tanggal saja
  if (dateString.includes(" ")) {
    return dateString.split(" ")[0];
  }

  // Jika sudah dalam format YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Fallback: parse dengan Date object untuk format lain
  const date = new Date(dateString);

  // Check if valid date
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return "";
  }

  // Format ke YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Load initial data
const fetchMainInfoData = async () => {
  ui.isLoading = true;

  try {
    const response = await fetchMainInfo(props.invitationId);

    Object.assign(formData, {
      id: response.id?.toString() || "",
      music_id: response.music_id?.toString() || "",
      main_photo: response.main_photo || null,
      wedding_date: formatDateForInput(response.wedding_date),
      wedding_time: response.wedding_time || "",
      time_zone: response.time_zone || "WIB",
      custom_backsound: response.custom_backsound || null,
    });

    if (formData.main_photo && typeof formData.main_photo === "string") {
      setMainPhotoPreview(response.main_photo_url);
    }

    if (
      formData.custom_backsound &&
      typeof formData.custom_backsound === "string"
    ) {
      setCustomBacksoundPreview(response.custom_backsound_url);
    }
  } catch (error) {
    console.error(error);
    console.error(error.validationErrors);
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

  emit("error", message);
};

// Form submission
const submitForm = async () => {
  if (ui.isSubmitting) return; // Prevent double submit

  ui.isFormTouched = true;

  if (!validateForm()) {
    emit("error", "Mohon lengkapi semua field yang wajib diisi.");
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
      await updateMainInfo(formData.id, dataToSubmit);
      emit("success", "Data pernikahan berhasil diperbarui!");
    } else {
      await createMainInfo(dataToSubmit);
      emit("success", "Data pernikahan berhasil disimpan!");
    }
  } catch (error) {
    handleSubmitError(error);
    console.error(error.validationErrors);
  } finally {
    ui.isSubmitting = false;
  }
};

onMounted(() => {
  fetchMainInfoData();
});

onBeforeUnmount(() => {
  clearTimeout(weddingTimeTimeout.value);

  // Cleanup audio player
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
});
</script>

<template>
  <!-- Loading State -->
  <div v-if="ui.isLoading" class="text-center py-8">
    <div
      class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
    >
      <Spinner />
      <p>Memuat data pernikahan...</p>
    </div>
  </div>

  <div v-else>
    <!-- Header -->
    <div>
      <h2
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        {{ formData?.id ? "Edit Data Pernikahan" : "Tambah Data Pernikahan" }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        ID Undangan: <span class="font-semibold">{{ invitationId }}</span>
      </p>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

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
        label="Foto Utama (Opsional)"
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
            class="bi bi-music-note-beamed text-blue-600 dark:text-blue-400"
          ></i>
          Backsound (Opsional)
        </h3>

        <!-- Music Library with Cards -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
          >
            Pilih dari Library
          </label>

          <!-- Selected Music Display - MODIFIKASI DI SINI -->
          <div v-if="selectedMusic && !formData.custom_backsound" class="mb-4">
            <div
              class="p-4 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <!-- Thumbnail -->
                <div class="flex-shrink-0">
                  <div
                    v-if="selectedMusic.thumbnail_url"
                    class="relative w-12 h-12 rounded-lg overflow-hidden"
                  >
                    <NuxtImg
                      :src="selectedMusic.thumbnail_url"
                      :alt="selectedMusic.name"
                      width="48"
                      height="48"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      format="webp"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                    ></div>
                  </div>
                  <div
                    v-else
                    class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                  >
                    <i class="bi bi-music-note-beamed text-white text-2xl"></i>
                  </div>
                </div>

                <!-- Music Info -->
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-semibold text-blue-900 dark:text-blue-300"
                  >
                    Musik Terpilih
                  </p>
                  <p
                    class="text-xs text-blue-700 dark:text-blue-400 truncate font-medium"
                    :title="`${selectedMusic.name} - ${selectedMusic.artist}`"
                  >
                    {{ selectedMusic.name }} - {{ selectedMusic.artist }}
                  </p>
                </div>

                <!-- Play/Pause Button -->
                <button
                  type="button"
                  @click="handleMusicPlay(selectedMusic)"
                  :disabled="ui.isAudioLoading"
                  class="flex-shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                >
                  <i
                    v-if="!isPlaying(selectedMusic.id)"
                    class="bi bi-play-fill text-base"
                  ></i>
                  <i v-else class="bi bi-pause-fill text-base"></i>
                </button>

                <!-- Remove Button -->
                <button
                  type="button"
                  @click="
                    formData.music_id = '';
                    pauseMusic();
                  "
                  class="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-all duration-200"
                >
                  <i class="bi bi-x-lg text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Music Cards Grid -->
          <div
            class="grid gap-3 max-h-96 overflow-y-auto pr-2"
            :class="
              formData.custom_backsound ? 'opacity-50 pointer-events-none' : ''
            "
          >
            <div
              v-for="music in musics"
              :key="music.id"
              @click="handleMusicSelect(music)"
              class="cursor-pointer transition-all duration-300"
            >
              <div
                class="relative bg-white dark:bg-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <div class="flex items-center gap-4 p-4">
                  <!-- Thumbnail Section -->
                  <div class="relative flex-shrink-0">
                    <div class="relative">
                      <NuxtImg
                        v-if="music.thumbnail_url"
                        :src="music.thumbnail_url"
                        :alt="music.name"
                        width="80"
                        height="80"
                        class="w-16 h-16 object-cover object-center rounded-xl border border-gray-200 dark:border-white/10"
                        loading="lazy"
                        format="webp"
                      />
                      <div
                        v-else
                        class="w-16 h-16 rounded-xl border border-gray-200 dark:border-white/10 flex flex-col justify-center items-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-500 dark:text-gray-600"
                      >
                        <i class="bi bi-music-note text-3xl"></i>
                      </div>

                      <!-- Selected Badge -->
                      <div
                        v-if="
                          formData.music_id === music.id ||
                          formData.music_id === music.id.toString()
                        "
                        class="absolute -top-1 -left-1 z-10"
                      >
                        <div
                          class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
                        >
                          <i
                            class="bi bi-check-lg text-white text-xs font-bold"
                          ></i>
                        </div>
                      </div>

                      <!-- Playing Indicator -->
                      <div
                        v-if="isPlaying(music.id)"
                        class="absolute -top-1 -right-1 z-10"
                      >
                        <div
                          class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 shadow-lg"
                        >
                          <div class="flex gap-0.5">
                            <span
                              class="w-0.5 h-2 bg-white rounded-full animate-pulse"
                            ></span>
                            <span
                              class="w-0.5 h-2 bg-white rounded-full animate-pulse"
                              style="animation-delay: 0.1s"
                            ></span>
                            <span
                              class="w-0.5 h-2 bg-white rounded-full animate-pulse"
                              style="animation-delay: 0.2s"
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Music Info Section -->
                  <div class="flex-1 min-w-0">
                    <h4
                      class="text-base font-bold text-gray-900 dark:text-white mb-0.5 line-clamp-1"
                      :title="music.name"
                    >
                      {{ music.name || "Untitled" }}
                    </h4>
                    <p
                      class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 flex items-center gap-1"
                      :title="music.artist"
                    >
                      <i class="bi bi-person-fill text-xs"></i>
                      <span>{{ music.artist || "Unknown Artist" }}</span>
                    </p>

                    <!-- Playing Status Text -->
                    <div
                      v-if="isPlaying(music.id)"
                      class="flex items-center gap-1.5 mt-2"
                    >
                      <i
                        class="bi bi-volume-up-fill text-green-500 text-sm animate-pulse"
                      ></i>
                      <span
                        class="text-xs font-medium text-green-600 dark:text-green-400"
                      >
                        Now Playing
                      </span>
                    </div>
                  </div>

                  <!-- Play Button -->
                  <div class="flex-shrink-0">
                    <button
                      type="button"
                      @click.stop="handleMusicPlay(music)"
                      :disabled="ui.isAudioLoading"
                      class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <i
                        v-if="!isPlaying(music.id)"
                        class="bi bi-play-fill text-lg ml-0.5"
                      ></i>
                      <i v-else class="bi bi-pause-fill text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="!musics || musics.length === 0"
              class="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              <i class="bi bi-music-note-list text-4xl mb-2"></i>
              <p>Tidak ada musik tersedia</p>
            </div>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {{
              formData.custom_backsound
                ? "Hapus backsound kustom untuk memilih dari library"
                : "Klik card untuk memilih musik, klik tombol play untuk preview"
            }}
          </p>

          <!-- Validation Error -->
          <p
            v-if="validationErrors.music_id"
            class="text-xs text-red-600 dark:text-red-400 mt-1"
          >
            {{ validationErrors.music_id }}
          </p>
        </div>

        <!-- Custom Backsound Upload -->
        <FormAudioUpload
          v-if="props.packageId != 1"
          ref="customBacksoundInput"
          label="Upload Backsound Kustom"
          accept="audio/*"
          :required="false"
          :preview="customBacksoundPreview"
          :error="validationErrors.custom_backsound"
          :disabled="!!formData.music_id"
          @change="handleCustomBacksoundChange"
          @remove="handleCustomBacksoundRemove"
        >
          <template #description>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format: MP3, WAV, OGG | Maksimal: 10MB
              {{
                formData.music_id
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
          class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

<style scoped>
/* Custom animation for playing indicator */
@keyframes pulse {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

.animate-pulse {
  animation: pulse 1s ease-in-out infinite;
}
</style>
