<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next", "step-status"]);

const { fetchMainInfo, createMainInfo, updateMainInfo } = useMainInfoStore();
const { musics } = storeToRefs(useMusicStore());

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

watch(
  isEditMode,
  (newValue) => {
    emit("step-status", newValue);
  },
  { immediate: true }
);

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
      groom: response.groom || "",
      bride: response.bride || "",
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

    emit("step-status", true);

    setTimeout(() => {
      emit("next");
    }, 3000);
  } catch (error) {
    console.error("Error submitting main info form:", error);
    console.error("Error submitting main info form:", error.validationErrors);

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
    groom: "",
    bride: "",
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
        Memuat informasi utama...
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
            {{ isEditMode ? "Edit Informasi Utama" : "Informasi Utama" }}
          </h2>
          <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            ID: <span class="font-medium">{{ invitationId }}</span>
          </p>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-4 md:space-y-6">
      <!-- Date & Time - Optimized for Mobile -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
      >
        <div class="flex items-center gap-2 mb-1 md:mb-4">
          <div
            class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
          >
            <i class="bi bi-calendar-heart text-sky-500"></i>
          </div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Waktu Acara
          </h3>
        </div>

        <FormBaseInput
          v-model="formData.wedding_date"
          type="date"
          label="Tanggal"
          :required="true"
          :error="validationErrors.wedding_date"
          @change="handleWeddingDateChange"
        />

        <div class="grid grid-cols-2 gap-3">
          <FormBaseInput
            v-model="formData.wedding_time"
            type="time"
            label="Jam"
            :required="true"
            :error="validationErrors.wedding_time"
            @input="handleWeddingTimeInput"
          />

          <FormBaseSelect
            v-model="formData.time_zone"
            label="Zona"
            placeholder="Pilih"
            :options="timezoneOptions"
            :required="true"
            :error="validationErrors.time_zone"
            @change="handleTimeZoneChange"
          />
        </div>
      </div>

      <!-- Main Photo Upload - Compact -->
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
            Foto Utama
            <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
          </h3>
        </div>

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
      </div>

      <!-- Backsound Section - Mobile Optimized -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-600 flex items-center justify-center shadow-sm transition-colors"
          >
            <i class="bi bi-music-note-beamed text-white"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Backsound
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300">Opsional</p>
          </div>
          <div
            v-if="hasBacksoundSelected"
            class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-full border border-emerald-200 dark:border-emerald-800"
          >
            <i class="bi bi-check-circle-fill text-emerald-500 text-xs"></i>
            <span
              class="text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              Terpilih
            </span>
          </div>
        </div>

        <!-- Selected Custom Backsound -->
        <div
          v-if="formData.custom_backsound || customBacksoundPreview"
          class="relative overflow-hidden rounded-2xl bg-sky-50 dark:bg-sky-950 border-2 border-sky-200 dark:border-sky-800 p-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0 shadow-sm"
            >
              <i class="bi bi-music-note-beamed text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-xs font-semibold text-slate-900 dark:text-slate-50"
              >
                Audio Kustom
              </p>
              <p class="text-xs text-slate-600 dark:text-slate-300 truncate">
                {{ customBacksoundPreview ? "Tersimpan" : "Baru dipilih" }}
              </p>
            </div>
            <button
              type="button"
              @click="
                removeCustomBacksound();
                formData.custom_backsound = null;
                clearBackendError('custom_backsound');
              "
              class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
            >
              <i class="bi bi-trash text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Selected Music from Library -->
        <div
          v-if="selectedMusic && !formData.custom_backsound"
          class="relative overflow-hidden rounded-2xl bg-sky-50 dark:bg-sky-950 border-2 border-sky-200 dark:border-sky-800 p-3"
        >
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
              <NuxtImg
                v-if="selectedMusic.thumbnail_url"
                :src="selectedMusic.thumbnail_url"
                :alt="selectedMusic.name"
                width="44"
                height="44"
                class="w-full h-full object-cover"
                loading="lazy"
                format="webp"
              />
              <div
                v-else
                class="w-full h-full bg-sky-500 flex items-center justify-center"
              >
                <i class="bi bi-music-note-beamed text-white"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-xs font-semibold text-slate-900 dark:text-slate-50 truncate"
              >
                {{ selectedMusic.name }}
              </p>
              <p
                class="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5"
              >
                {{ selectedMusic.artist }}
              </p>
            </div>
            <button
              type="button"
              @click="handleMusicPlay(selectedMusic)"
              :disabled="ui.isAudioLoading"
              class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
            >
              <i
                v-if="!isPlaying(selectedMusic.id)"
                class="bi bi-play-fill"
              ></i>
              <i v-else class="bi bi-pause-fill"></i>
            </button>
            <button
              type="button"
              @click="
                formData.music_id = '';
                pauseMusic();
              "
              class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
            >
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Music Library -->
        <div
          :class="
            formData.custom_backsound ? 'opacity-50 pointer-events-none' : ''
          "
        >
          <label
            class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
          >
            Pilih dari Library
          </label>

          <div class="space-y-2 md:space-y-3 max-h-80 overflow-y-auto">
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
              class="text-center py-12 text-slate-400 dark:text-slate-500"
            >
              <i class="bi bi-music-note-list text-3xl mb-2"></i>
              <p class="text-sm">Tidak ada musik</p>
            </div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mt-2">
            {{
              formData.custom_backsound
                ? "Hapus audio kustom untuk pilih dari library"
                : "Tap untuk pilih, tap play untuk dengar"
            }}
          </p>
        </div>

        <div
          class="relative w-full border-t border-slate-200 dark:border-slate-800"
        >
          <span
            class="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white dark:bg-slate-900 text-xs text-slate-400 dark:text-slate-500"
            >atau</span
          >
        </div>

        <!-- Custom Upload -->
        <FormAudioUpload
          v-if="props.packageId != 1"
          ref="customBacksoundInput"
          label="Upload Audio Kustom"
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
      </div>

      <!-- Fixed Bottom Action Bar -->
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
