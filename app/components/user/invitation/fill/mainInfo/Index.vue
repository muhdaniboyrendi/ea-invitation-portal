<script setup>
// Props & Emits
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

// Store
const { fetchMainInfo, createMainInfo, updateMainInfo } = useMainInfoStore();
const { musics } = storeToRefs(useMusicStore());

// Refs
const audioPlayer = ref(null);

// Constants
const timezoneOptions = [
  { id: "WIB", name: "WIB (Waktu Indonesia Barat)" },
  { id: "WITA", name: "WITA (Waktu Indonesia Tengah)" },
  { id: "WIT", name: "WIT (Waktu Indonesia Timur)" },
];

const validationPatterns = {
  wedding_date: {
    required: /^.+$/,
    message: { required: "Tanggal pernikahan wajib diisi" },
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
    message: { required: "Zona waktu wajib dipilih" },
  },
};

// Form Validation
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
  resetErrors,
} = useFormValidation(validationPatterns);

// File Upload - Main Photo
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
  },
  onError: (message) => emit("error", message),
});

// File Upload - Custom Backsound
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
  maxSize: 20 * 1024 * 1024,
  onSuccess: (file) => {
    formData.custom_backsound = file;
    formData.music_id = "";
    clearBackendError("custom_backsound");
  },
  onError: (message) => emit("error", message),
});

// Form Data
const formData = reactive({
  id: null,
  invitation_id: props.invitationId,
  music_id: "",
  main_photo: null,
  wedding_date: "",
  wedding_time: "",
  time_zone: "WIB",
  custom_backsound: null,
});

const ui = reactive({
  isLoading: true,
  isSubmitting: false,
  currentPlayingId: null,
  isAudioLoading: false,
});

// Computed
const isEditMode = computed(() => !!formData.id);

const isFormValid = computed(() => {
  return (
    Object.keys(validationErrors.value).length === 0 &&
    formData.wedding_date &&
    formData.wedding_time &&
    formData.time_zone
  );
});

const hasBacksoundSelected = computed(
  () => !!(formData.music_id || formData.custom_backsound)
);

const selectedMusic = computed(() => {
  if (!formData.music_id) return null;
  return musics.value.find((m) => m.id == formData.music_id);
});

const isPlaying = (musicId) => ui.currentPlayingId === musicId;

// Validation
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;
  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;
  if (!validateField("wedding_date", formData.wedding_date)) isValid = false;
  if (!validateField("wedding_time", formData.wedding_time)) isValid = false;
  if (!validateField("time_zone", formData.time_zone)) isValid = false;
  return isValid;
};

// Music Player
const playMusic = async (music) => {
  try {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0;
    }

    audioPlayer.value = new Audio(music.audio_url);

    audioPlayer.value.addEventListener("ended", () => {
      ui.currentPlayingId = null;
    });

    audioPlayer.value.addEventListener("error", () => {
      emit("error", "Gagal memutar musik. File tidak ditemukan.");
      ui.currentPlayingId = null;
    });

    ui.isAudioLoading = true;
    await audioPlayer.value.play();
    ui.currentPlayingId = music.id;
  } catch (error) {
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

// Handlers
const handleMusicSelect = (music) => {
  formData.music_id = music.id;
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
  clearBackendError("wedding_date");
  validateField("wedding_date", formData.wedding_date);
};

const handleWeddingTimeInput = () => {
  clearBackendError("wedding_time");
  validateField("wedding_time", formData.wedding_time);
};

const handleTimeZoneChange = () => {
  clearBackendError("time_zone");
  validateField("time_zone", formData.time_zone);
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes(" ")) return dateString.split(" ")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// API Calls
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
  } finally {
    ui.isLoading = false;
  }
};

const submitForm = async () => {
  if (ui.isSubmitting || !validateForm()) {
    emit("error", "Mohon lengkapi semua field yang wajib diisi.");
    return;
  }

  ui.isSubmitting = true;
  try {
    const dataToSubmit = { ...formData };

    if (isEditMode.value && !isMainPhotoUpdated.value) {
      dataToSubmit.main_photo = null;
    }

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
      `Gagal ${
        isEditMode.value ? "memperbarui" : "menyimpan"
      } data pernikahan.`;
    emit("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    invitation_id: props.invitationId,
    music_id: "",
    main_photo: null,
    wedding_date: "",
    wedding_time: "",
    time_zone: "WIB",
    custom_backsound: null,
  });

  resetErrors();
  resetMainPhotoUpload();
  resetCustomBacksoundUpload();
  pauseMusic();
};

// Lifecycle
onMounted(() => {
  fetchMainInfoData();
});

onBeforeUnmount(() => {
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
      class="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>
      <p>Memuat informasi utama...</p>
    </div>
  </div>

  <div v-else>
    <!-- Header -->
    <div>
      <h2
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        {{ isEditMode ? "Edit Informasi Utama" : "Tambah Informasi Utama" }}
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        ID Undangan: <span class="font-semibold">{{ invitationId }}</span>
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Wedding Date & Time -->
      <div class="grid md:grid-cols-2 gap-4">
        <FormBaseInput
          v-model="formData.wedding_date"
          type="date"
          label="Tanggal Pernikahan"
          :required="true"
          :error="validationErrors.wedding_date"
          @change="handleWeddingDateChange"
        />

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
        :preview="mainPhotoPreview"
        :error="validationErrors.main_photo"
        @change="
          (e) => {
            const file = handleMainPhotoUpload(e);
            if (file) formData.main_photo = file;
          }
        "
        @remove="
          () => {
            removeMainPhoto();
            formData.main_photo = null;
            clearBackendError('main_photo');
          }
        "
      />

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

        <!-- Custom Backsound Preview (when exists) -->
        <div
          v-if="formData.custom_backsound || customBacksoundPreview"
          class="mb-4"
        >
          <div
            class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <i class="bi bi-music-note-beamed text-white text-2xl"></i>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-semibold text-purple-900 dark:text-purple-300"
                >
                  Backsound Kustom Terpilih
                </p>
                <p
                  class="text-xs text-purple-700 dark:text-purple-400 truncate font-medium"
                >
                  {{
                    customBacksoundPreview
                      ? "File audio kustom"
                      : "Audio kustom baru"
                  }}
                </p>
              </div>

              <button
                type="button"
                @click="
                  removeCustomBacksound();
                  formData.custom_backsound = null;
                  clearBackendError('custom_backsound');
                "
                class="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1.5 transition-all duration-200 text-sm font-medium"
              >
                <i class="bi bi-trash text-sm"></i>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Selected Music Display -->
        <div v-if="selectedMusic && !formData.custom_backsound" class="mb-4">
          <div
            class="p-4 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl"
          >
            <div class="flex items-center gap-3">
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
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                >
                  <i class="bi bi-music-note-beamed text-white text-2xl"></i>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-semibold text-blue-900 dark:text-blue-300"
                >
                  Musik Terpilih
                </p>
                <p
                  class="text-xs text-blue-700 dark:text-blue-400 truncate font-medium"
                >
                  {{ selectedMusic.name }} - {{ selectedMusic.artist }}
                </p>
              </div>

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
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
          >
            Pilih dari Library
          </label>

          <div
            class="grid gap-3 max-h-96 overflow-y-auto pr-2"
            :class="
              formData.custom_backsound ? 'opacity-50 pointer-events-none' : ''
            "
          >
            <UserInvitationFillMainInfoMusicCard
              v-for="music in musics"
              :key="music.id"
              :music="music"
              :is-selected="formData.music_id == music.id"
              :is-playing="isPlaying(music.id)"
              :is-audio-loading="ui.isAudioLoading"
              :disabled="!!formData.custom_backsound"
              @select="handleMusicSelect"
              @play="handleMusicPlay"
            />

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
        </div>

        <!-- Custom Backsound Upload -->
        <FormAudioUpload
          v-if="props.packageId != 1"
          ref="customBacksoundInput"
          label="Upload Backsound Kustom"
          :preview="customBacksoundPreview"
          :error="validationErrors.custom_backsound"
          :disabled="!!formData.music_id"
          @change="
            (e) => {
              const file = handleCustomBacksoundUpload(e);
              if (file) formData.custom_backsound = file;
            }
          "
          @remove="
            () => {
              removeCustomBacksound();
              formData.custom_backsound = null;
              clearBackendError('custom_backsound');
            }
          "
        />

        <!-- Backsound Status -->
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
          class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="ui.isSubmitting || !isFormValid"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
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
