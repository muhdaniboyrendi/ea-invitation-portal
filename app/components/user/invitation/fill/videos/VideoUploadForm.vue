<script setup>
const props = defineProps({
  invitationId: { type: [Number, String], required: true },
  maxVideos: { type: Number, required: true },
  maxVideosText: { type: [Number, String], required: true },
  hasVideoLimit: { type: Boolean, required: true },
});

const emit = defineEmits(["success", "error", "cancel"]);

const { createVideos } = useVideoStore();
const { compressVideoWithAudio, validateVideo, ALLOWED_TYPES, MAX_SIZE } =
  useVideoCompression();

const ui = reactive({
  isSubmitting: false,
});

const videoUpload = reactive({
  previews: [],
  files: [],
  originalFiles: [],
  errors: [],
  isDragging: false,
  isCompressing: false,
  compressionProgress: 0,
  currentCompressingFile: "",
});

const isFormValid = computed(() => {
  const hasFiles = videoUpload.files.length > 0;
  const withinLimit = props.hasVideoLimit
    ? videoUpload.files.length <= props.maxVideos
    : true;
  const noErrors = videoUpload.errors.length === 0;
  const notCompressing = !videoUpload.isCompressing;
  return hasFiles && withinLimit && noErrors && notCompressing;
});

const remainingSlots = computed(() => {
  if (!props.hasVideoLimit) return Infinity;
  return props.maxVideos - videoUpload.files.length;
});

const remainingSlotsText = computed(() => {
  if (!props.hasVideoLimit) return "Tidak Terbatas";
  return `${remainingSlots.value} slot tersisa`;
});

const canAddMoreVideos = computed(() => {
  if (!props.hasVideoLimit) return true;
  return videoUpload.files.length < props.maxVideos;
});

const handleVideoSelect = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
};

const handleDrop = (event) => {
  videoUpload.isDragging = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = async (files) => {
  videoUpload.errors = [];
  const totalCount = videoUpload.files.length + files.length;

  if (props.hasVideoLimit && totalCount > props.maxVideos) {
    videoUpload.errors.push(
      `Maksimal ${props.maxVideos} video. Anda sudah memiliki ${videoUpload.files.length} video.`
    );
    return;
  }

  videoUpload.isCompressing = true;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    videoUpload.currentCompressingFile = file.name;
    videoUpload.compressionProgress = Math.round(
      ((i + 1) / files.length) * 100
    );

    const errors = validateVideo(file);
    if (errors.length > 0) {
      videoUpload.errors.push(...errors);
      continue;
    }

    try {
      const compressedFile = await compressVideoWithAudio(file);

      // Validasi compressed file
      if (!compressedFile || compressedFile.size === 0) {
        videoUpload.errors.push(`${file.name}: Video hasil kompresi kosong`);
        continue;
      }

      if (compressedFile.size > MAX_SIZE) {
        videoUpload.errors.push(
          `${file.name}: Video masih terlalu besar setelah kompresi (maksimal 150MB)`
        );
        continue;
      }

      // Buat preview dengan Promise untuk memastikan selesai
      const previewUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          resolve(e.target.result);
        };

        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject(error);
        };

        reader.readAsDataURL(compressedFile);
      });

      // Hitung statistik
      const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
      const compressionRatio = (
        (1 - compressedFile.size / file.size) *
        100
      ).toFixed(0);

      // Tambahkan preview
      videoUpload.previews.push({
        id: Date.now() + Math.random(),
        url: previewUrl,
        name: file.name,
        originalSize: originalSizeMB,
        compressedSize: compressedSizeMB,
        compressionRatio: compressionRatio,
      });

      // Tambahkan file setelah preview berhasil dibuat
      videoUpload.files.push(compressedFile);
      videoUpload.originalFiles.push(file);
    } catch (error) {
      console.error("Compression error:", error);
      videoUpload.errors.push(
        `${file.name}: ${error.message || "Gagal mengkompresi video"}`
      );
    }
  }

  videoUpload.isCompressing = false;
  videoUpload.compressionProgress = 0;
  videoUpload.currentCompressingFile = "";

  if (videoUpload.errors.length > 0) {
    emit("error", videoUpload.errors.join("; "));
  }
};

const removeVideo = (index) => {
  videoUpload.previews.splice(index, 1);
  videoUpload.files.splice(index, 1);
  videoUpload.originalFiles.splice(index, 1);
  videoUpload.errors = [];
};

const clearAllVideos = () => {
  videoUpload.previews = [];
  videoUpload.files = [];
  videoUpload.originalFiles = [];
  videoUpload.errors = [];
};

const handleDragOver = (event) => {
  videoUpload.isDragging = true;
};

const handleDragLeave = (event) => {
  videoUpload.isDragging = false;
};

const submitForm = async () => {
  if (!isFormValid.value) {
    const limitText = props.hasVideoLimit
      ? `maksimal ${props.maxVideos} video`
      : "video";
    emit("error", `Mohon pilih minimal 1 video (${limitText}).`);
    return;
  }
  if (ui.isSubmitting) return;

  ui.isSubmitting = true;

  try {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("invitation_id", props.invitationId);

    videoUpload.files.forEach((file, index) => {
      formDataToSubmit.append("videos[]", file);
    });

    await createVideos(formDataToSubmit);

    // Simpan count sebelum reset
    const uploadedCount = videoUpload.files.length;

    // Emit success dengan count SETELAH upload berhasil
    emit("success", uploadedCount);

    // JANGAN reset di sini, biarkan parent component yang handle
    // resetForm() akan dipanggil otomatis ketika form ditutup
  } catch (error) {
    console.error("Failed to upload videos:", error);
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Gagal mengunggah video.";
    emit("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const resetForm = () => {
  clearAllVideos();
};

const handleCancel = () => {
  resetForm();
  emit("cancel");
};

// Watch for when component is about to unmount or hidden
onBeforeUnmount(() => {
  // Cleanup any object URLs to prevent memory leaks
  videoUpload.previews.forEach((preview) => {
    if (preview.url && preview.url.startsWith("blob:")) {
      URL.revokeObjectURL(preview.url);
    }
  });
});
</script>

<template>
  <div class="space-y-3 md:space-y-6">
    <!-- Compression Progress -->
    <UserInvitationFillVideosVideoCompressionProgress
      v-if="videoUpload.isCompressing"
      :progress="videoUpload.compressionProgress"
      :current-file="videoUpload.currentCompressingFile"
    />

    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
    >
      <div class="flex items-center gap-2 mb-1 md:mb-4">
        <div
          class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
        >
          <i class="bi bi-cloud-upload text-sky-500"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Unggah Video
          <span class="text-xs text-slate-400 font-normal ml-1"
            >(Maks {{ maxVideosText }})</span
          >
        </h3>
      </div>

      <div
        class="bg-sky-50 dark:bg-sky-950 rounded-2xl p-3 border border-sky-200 dark:border-sky-800"
      >
        <p class="text-xs text-sky-600 dark:text-sky-400">
          ✨ Video akan otomatis dikompresi untuk hasil terbaik
        </p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 md:space-y-6">
        <!-- Drop Zone -->
        <UserInvitationFillVideosVideoDropZone
          :can-add-more="canAddMoreVideos"
          :is-compressing="videoUpload.isCompressing"
          :is-dragging="videoUpload.isDragging"
          :remaining-slots-text="remainingSlotsText"
          :max-videos-text="maxVideosText"
          @select="handleVideoSelect"
          @drop="handleDrop"
          @drag-over="handleDragOver"
          @drag-leave="handleDragLeave"
        />

        <!-- Preview Grid -->
        <UserInvitationFillVideosVideoPreviewGrid
          v-if="videoUpload.previews.length > 0"
          :previews="videoUpload.previews"
          :is-compressing="videoUpload.isCompressing"
          @remove="removeVideo"
          @clear-all="clearAllVideos"
        />

        <div class="flex gap-3 pt-3">
          <button
            type="button"
            @click="handleCancel"
            :disabled="ui.isSubmitting || videoUpload.isCompressing"
            class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
          <button
            type="submit"
            :disabled="
              ui.isSubmitting || !isFormValid || videoUpload.isCompressing
            "
            class="flex-1 h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span v-if="!ui.isSubmitting && !videoUpload.isCompressing">
              <i class="bi bi-cloud-upload mr-1"></i>
              Unggah {{ videoUpload.files.length }} Video
            </span>
            <span
              v-else-if="videoUpload.isCompressing"
              class="flex items-center gap-2"
            >
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Mengkompresi...
            </span>
            <span v-else class="flex items-center gap-2">
              <Spinner />
              Mengunggah...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
