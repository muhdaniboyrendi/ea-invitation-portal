<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchVideos, createVideos, deleteVideo } = useVideoStore();

// Reactive form data object
const formData = reactive({
  invitation_id: props.invitationId,
  videos: [],
});

const ui = reactive({
  isLoading: true,
  isSubmitting: false,
  showForm: false,
});

// Multiple Videos Upload State
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

// Delete Modal State
const deleteModal = reactive({
  show: false,
  isDeleting: false,
  videoId: null,
  videoUrl: "",
  videoThumbnail: "",
});

const videos = ref([]);

// Dynamic MAX_VIDEOS based on packageId
const MAX_VIDEOS = computed(() => {
  const pkgId = Number(props.packageId);
  if (pkgId === 1) return 0;
  if (pkgId === 2) return 1;
  if (pkgId === 3) return 10;
  if (pkgId > 3) return Infinity;
  return 1;
});

const allowsVideos = computed(() => MAX_VIDEOS.value > 0);
const hasVideoLimit = computed(
  () => MAX_VIDEOS.value !== Infinity && MAX_VIDEOS.value > 0
);
const maxVideosText = computed(() => {
  if (!allowsVideos.value) return "Tidak Tersedia";
  return hasVideoLimit.value ? MAX_VIDEOS.value : "Tidak Terbatas";
});

const MAX_SIZE = 100 * 1024 * 1024;
const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

// Compression settings
const COMPRESSION_SETTINGS = {
  maxWidth: 1280,
  maxHeight: 720,
  targetBitrate: 1000000,
  quality: 0.7,
};

// Computed Properties
const isFormValid = computed(() => {
  const hasFiles = videoUpload.files.length > 0;
  const withinLimit = hasVideoLimit.value
    ? videoUpload.files.length <= MAX_VIDEOS.value
    : true;
  const noErrors = videoUpload.errors.length === 0;
  const notCompressing = !videoUpload.isCompressing;
  return hasFiles && withinLimit && noErrors && notCompressing;
});

const remainingSlots = computed(() => {
  if (!hasVideoLimit.value) return Infinity;
  return MAX_VIDEOS.value - videoUpload.files.length;
});

const remainingSlotsText = computed(() => {
  if (!hasVideoLimit.value) return "Tidak Terbatas";
  return `${remainingSlots.value} slot tersisa`;
});

const canAddMoreVideos = computed(() => {
  if (!hasVideoLimit.value) return true;
  return videoUpload.files.length < MAX_VIDEOS.value;
});

// Video Upload Handlers
const validateVideo = (file) => {
  const errors = [];
  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push(
      `${file.name}: Format tidak didukung (hanya MP4, WEBM, OGG, MOV)`
    );
  }
  return errors;
};

// Video Compression Function
const compressVideoSimple = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;

    video.onloadedmetadata = async () => {
      try {
        if (file.size < 10 * 1024 * 1024) {
          resolve(file);
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = video.videoWidth;
        let height = video.videoHeight;
        const aspectRatio = width / height;

        if (width > COMPRESSION_SETTINGS.maxWidth) {
          width = COMPRESSION_SETTINGS.maxWidth;
          height = width / aspectRatio;
        }
        if (height > COMPRESSION_SETTINGS.maxHeight) {
          height = COMPRESSION_SETTINGS.maxHeight;
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        const chunks = [];
        const stream = canvas.captureStream(25);

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
          videoBitsPerSecond: COMPRESSION_SETTINGS.targetBitrate,
        });

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const fileName =
            file.name.replace(/\.[^/.]+$/, "") + "_compressed.webm";
          const compressedFile = new File([blob], fileName, {
            type: "video/webm",
          });
          resolve(compressedFile);
        };

        mediaRecorder.start();
        video.play();

        const drawFrame = () => {
          if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, width, height);
            requestAnimationFrame(drawFrame);
          }
        };
        drawFrame();

        video.onended = () => {
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
};

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

  if (hasVideoLimit.value && totalCount > MAX_VIDEOS.value) {
    videoUpload.errors.push(
      `Maksimal ${MAX_VIDEOS.value} video. Anda sudah memiliki ${videoUpload.files.length} video.`
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
      const compressedFile = await compressVideoSimple(file);

      if (compressedFile.size > MAX_SIZE) {
        videoUpload.errors.push(
          `${file.name}: Video masih terlalu besar setelah kompresi (maksimal 50MB)`
        );
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(
          2
        );
        const compressionRatio = (
          (1 - compressedFile.size / file.size) *
          100
        ).toFixed(0);

        videoUpload.previews.push({
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
          originalSize: originalSizeMB,
          compressedSize: compressedSizeMB,
          compressionRatio: compressionRatio,
        });
      };
      reader.readAsDataURL(compressedFile);

      videoUpload.files.push(compressedFile);
      videoUpload.originalFiles.push(file);
    } catch (error) {
      console.error("Compression error:", error);
      videoUpload.errors.push(`${file.name}: Gagal mengkompresi video`);
    }
  }

  videoUpload.isCompressing = false;
  videoUpload.compressionProgress = 0;
  videoUpload.currentCompressingFile = "";

  if (videoUpload.errors.length > 0) {
    emit("error", videoUpload.errors.join("; "));
  } else if (files.length > 0) {
    emit("success", `${files.length} video berhasil dikompresi!`);
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

// API Calls
const fetchData = async () => {
  ui.isLoading = true;
  try {
    const response = await fetchVideos(props.invitationId);
    videos.value = response || [];
  } catch (error) {
    console.error("Failed to fetch videos:", error);
  } finally {
    ui.isLoading = false;
  }
};

const refreshData = async () => {
  try {
    const response = await fetchVideos(props.invitationId);
    videos.value = response || [];
  } catch (error) {
    console.error("Failed to fetch videos:", error);
  }
};

const submitForm = async () => {
  if (!isFormValid.value) {
    const limitText = hasVideoLimit.value
      ? `maksimal ${MAX_VIDEOS.value} video`
      : "video";
    emit("error", `Mohon pilih minimal 1 video (${limitText}).`);
    return;
  }
  if (ui.isSubmitting) return;

  ui.isSubmitting = true;
  try {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("invitation_id", props.invitationId);

    videoUpload.files.forEach((file) => {
      formDataToSubmit.append("videos[]", file);
    });

    await createVideos(formDataToSubmit);
    emit(
      "success",
      `${videoUpload.files.length} video berhasil ditambahkan ke galeri!`
    );

    await refreshData();
    resetForm();
    ui.showForm = false;
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

// Delete Modal Handlers
const openDeleteModal = (video) => {
  deleteModal.videoId = video.id;
  deleteModal.videoUrl = video.video_url;
  deleteModal.videoThumbnail = video.thumbnail_url || "";
  deleteModal.show = true;
};

const closeDeleteModal = () => {
  deleteModal.show = false;
  deleteModal.videoId = null;
  deleteModal.videoUrl = "";
  deleteModal.videoThumbnail = "";
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteVideo(deleteModal.videoId);
    emit("success", "Video berhasil dihapus dari galeri!");
    fetchData();
  } catch (error) {
    const message = error?.message || "Gagal menghapus video.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
    closeDeleteModal();
  }
};

const resetForm = () => {
  clearAllVideos();
  formData.videos = [];
};

const toggleForm = () => {
  if (ui.showForm) {
    resetForm();
  }
  ui.showForm = !ui.showForm;
};

const handleNext = () => {
  emit("next");
};

// Video Player functionality
const videoPlayer = reactive({
  show: false,
  currentIndex: 0,
});

const openVideoPlayer = (index) => {
  videoPlayer.currentIndex = index;
  videoPlayer.show = true;
};

const closeVideoPlayer = () => {
  videoPlayer.show = false;
};

const nextVideo = () => {
  if (videoPlayer.currentIndex < videos.value.length - 1) {
    videoPlayer.currentIndex++;
  } else {
    videoPlayer.currentIndex = 0;
  }
};

const prevVideo = () => {
  if (videoPlayer.currentIndex > 0) {
    videoPlayer.currentIndex--;
  } else {
    videoPlayer.currentIndex = videos.value.length - 1;
  }
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
        Memuat galeri video...
      </p>
    </div>
  </div>

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Package Restriction Notice -->
    <div
      v-if="!allowsVideos"
      class="bg-amber-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-center border-2 border-amber-200 dark:border-amber-800"
    >
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center mb-4"
      >
        <i class="bi bi-lock-fill text-amber-500 text-3xl"></i>
      </div>
      <h3
        class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
      >
        Fitur Video Tidak Tersedia
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Paket Anda saat ini tidak mendukung penambahan video. Upgrade paket
        untuk menggunakan fitur ini.
      </p>
    </div>

    <template v-else>
      <!-- Compression Progress -->
      <div
        v-if="videoUpload.isCompressing"
        class="bg-sky-50 dark:bg-sky-950 rounded-3xl p-4 md:p-6 border border-sky-200 dark:border-sky-800"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
          ></div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Mengkompresi Video...
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 truncate">
              {{ videoUpload.currentCompressingFile }}
            </p>
          </div>
          <span class="text-lg font-bold text-sky-500 flex-shrink-0">
            {{ videoUpload.compressionProgress }}%
          </span>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            class="bg-sky-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${videoUpload.compressionProgress}%` }"
          ></div>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
          💡 Video sedang dikompresi untuk hasil terbaik
        </p>
      </div>

      <!-- Video Header -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
            >
              <i class="bi bi-camera-video text-sky-500 text-lg"></i>
            </div>
            <div>
              <h2
                class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
              >
                Galeri Video
              </h2>
              <p class="text-xs text-slate-600 dark:text-slate-300">
                {{ videos.length }} video{{
                  hasVideoLimit ? ` / ${MAX_VIDEOS}` : ""
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Grid -->
      <div v-if="videos.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(video, index) in videos"
            :key="video.id"
            class="group relative aspect-video rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer"
          >
            <video
              v-if="video.video_url"
              :src="video.video_url"
              class="w-full h-full object-cover"
              preload="metadata"
            ></video>
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-700"
            >
              <i class="bi bi-play-circle text-5xl text-slate-500"></i>
            </div>

            <!-- Play Icon Overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300"
            >
              <button
                @click="openVideoPlayer(index)"
                class="w-16 h-16 bg-white/90 text-sky-500 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
              >
                <i class="bi bi-play-fill text-2xl ml-1"></i>
              </button>
            </div>

            <!-- Action Buttons -->
            <div
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
            >
              <button
                @click.stop="openVideoPlayer(index)"
                class="w-9 h-9 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center"
                title="Putar"
              >
                <i class="bi bi-play-fill text-sm"></i>
              </button>
              <button
                @click.stop="openDeleteModal(video)"
                class="w-9 h-9 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center"
                title="Hapus"
              >
                <i class="bi bi-trash text-sm"></i>
              </button>
            </div>

            <!-- Video Info -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2"
            >
              <p class="text-xs font-medium truncate">Video {{ index + 1 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800"
      >
        <div
          class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
        >
          <i class="bi bi-camera-video text-sky-500 text-3xl"></i>
        </div>
        <h3
          class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
        >
          Belum Ada Video
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Tambahkan video menarik untuk galeri acara Anda
        </p>
      </div>

      <!-- Toggle Form Button -->
      <button
        @click="toggleForm"
        class="w-full h-12 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        :class="
          ui.showForm
            ? 'bg-slate-500 hover:bg-slate-600 text-white shadow-slate-500/25'
            : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25'
        "
      >
        <i :class="ui.showForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
        {{ ui.showForm ? "Batal" : "Tambah Video" }}
      </button>

      <!-- Upload Form -->
      <div
        v-if="ui.showForm"
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
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            :class="[
              'border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-300',
              videoUpload.isDragging
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950'
                : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600',
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              @change="handleVideoSelect"
              class="hidden"
              :disabled="!canAddMoreVideos || videoUpload.isCompressing"
            />

            <div v-if="canAddMoreVideos && !videoUpload.isCompressing">
              <div
                class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
              >
                <i class="bi bi-cloud-arrow-up text-sky-500 text-3xl"></i>
              </div>
              <h4
                class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2"
              >
                Seret & Lepas video di sini
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 mb-4">
                atau klik tombol di bawah untuk memilih video
              </p>
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
              >
                <i class="bi bi-folder2-open mr-1"></i>
                Pilih Video
              </button>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-4">
                MP4, WEBM, OGG, MOV • Max 100MB • {{ remainingSlotsText }}
              </p>
            </div>

            <div
              v-else-if="videoUpload.isCompressing"
              class="text-slate-600 dark:text-slate-400"
            >
              <div
                class="w-12 h-12 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              ></div>
              <p class="text-sm">Sedang mengkompresi video...</p>
            </div>

            <div v-else class="text-slate-600 dark:text-slate-400">
              <i
                class="bi bi-check-circle-fill text-4xl text-emerald-500 mb-2"
              ></i>
              <p class="text-sm">Maksimal {{ maxVideosText }} video tercapai</p>
            </div>
          </div>

          <!-- Preview Grid -->
          <div v-if="videoUpload.previews.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
              <h4
                class="text-xs font-semibold text-slate-900 dark:text-slate-50"
              >
                Preview ({{ videoUpload.previews.length }} video)
              </h4>
              <button
                type="button"
                @click="clearAllVideos"
                :disabled="videoUpload.isCompressing"
                class="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50 transition-colors"
              >
                <i class="bi bi-x-circle mr-1"></i>
                Hapus Semua
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="(preview, index) in videoUpload.previews"
                :key="preview.id"
                class="group relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
              >
                <video
                  :src="preview.url"
                  class="w-full h-full object-cover"
                  controls
                  preload="metadata"
                ></video>
                <button
                  type="button"
                  @click="removeVideo(index)"
                  :disabled="videoUpload.isCompressing"
                  class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                  title="Hapus"
                >
                  <i class="bi bi-trash text-xs"></i>
                </button>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white text-xs p-2"
                >
                  <p class="truncate font-medium mb-1">{{ preview.name }}</p>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-slate-300 flex items-center gap-1">
                      <i class="bi bi-file-earmark text-red-400"></i>
                      {{ preview.originalSize }} MB
                    </span>
                    <span class="text-emerald-400">→</span>
                    <span class="text-emerald-300 flex items-center gap-1">
                      <i class="bi bi-file-earmark-check text-emerald-400"></i>
                      {{ preview.compressedSize }} MB
                    </span>
                  </div>
                  <div class="mt-1 text-center">
                    <span
                      class="bg-emerald-500/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
                    >
                      🎉 Hemat {{ preview.compressionRatio }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-3">
            <button
              type="button"
              @click="toggleForm"
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
    </template>

    <!-- Next Button -->
    <div class="pt-2">
      <button
        @click="handleNext"
        :disabled="videoUpload.isCompressing"
        class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Lanjutkan
        <i class="bi bi-arrow-right"></i>
      </button>
      <p class="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
        Galeri video bersifat opsional, Anda bisa melewatinya
      </p>
    </div>

    <!-- Video Player Modal -->
    <div
      v-if="videoPlayer.show"
      @click="closeVideoPlayer"
      class="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
    >
      <button
        @click="closeVideoPlayer"
        class="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
      >
        <i class="bi bi-x-lg text-xl"></i>
      </button>

      <button
        @click.stop="prevVideo"
        class="absolute left-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
      >
        <i class="bi bi-chevron-left text-2xl"></i>
      </button>

      <button
        @click.stop="nextVideo"
        class="absolute right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
      >
        <i class="bi bi-chevron-right text-2xl"></i>
      </button>

      <video
        v-if="videos[videoPlayer.currentIndex]"
        :src="videos[videoPlayer.currentIndex].video_url"
        @click.stop
        class="max-w-full max-h-full rounded-2xl"
        controls
        autoplay
      ></video>

      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        {{ videoPlayer.currentIndex + 1 }} / {{ videos.length }}
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="deleteModal.show"
      :is-deleting="deleteModal.isDeleting"
      title="Hapus Video?"
      message="Apakah Anda yakin ingin menghapus video ini dari galeri?"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    >
      <template #preview>
        <video
          v-if="deleteModal.videoUrl"
          :src="deleteModal.videoUrl"
          class="w-full h-48 object-cover rounded-2xl mt-4"
          preload="metadata"
        ></video>
      </template>
    </ConfirmDeleteModal>
  </div>
</template>
