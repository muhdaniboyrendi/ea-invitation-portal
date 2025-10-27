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
  originalFiles: [], // Store original files for reference
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

// ✅ Dynamic MAX_VIDEOS based on packageId
const MAX_VIDEOS = computed(() => {
  const pkgId = Number(props.packageId);

  if (pkgId === 1) return 0; // No video allowed
  if (pkgId === 2) return 1;
  if (pkgId === 3) return 10;
  if (pkgId > 3) return Infinity; // No limit

  return 1; // Default fallback
});

// ✅ Check if package allows videos
const allowsVideos = computed(() => {
  return MAX_VIDEOS.value > 0;
});

// ✅ Check if package has limit
const hasVideoLimit = computed(() => {
  return MAX_VIDEOS.value !== Infinity && MAX_VIDEOS.value > 0;
});

// ✅ Display text for max videos
const maxVideosText = computed(() => {
  if (!allowsVideos.value) return "Tidak Tersedia";
  return hasVideoLimit.value ? MAX_VIDEOS.value : "Tidak Terbatas";
});

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
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
  targetBitrate: 1000000, // 1 Mbps
  quality: 0.7, // 0-1 scale
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

// ✅ Display text for remaining slots
const remainingSlotsText = computed(() => {
  if (!hasVideoLimit.value) return "Tidak Terbatas";
  return `${remainingSlots.value} slot tersisa`;
});

// ✅ Check if can add more videos
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

  // Note: We'll check size after compression
  return errors;
};

// ✅ Video Compression Function
const compressVideo = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.preload = "metadata";
    video.muted = true;

    video.onloadedmetadata = async () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > COMPRESSION_SETTINGS.maxWidth) {
          height = (height * COMPRESSION_SETTINGS.maxWidth) / width;
          width = COMPRESSION_SETTINGS.maxWidth;
        }
        if (height > COMPRESSION_SETTINGS.maxHeight) {
          width = (width * COMPRESSION_SETTINGS.maxHeight) / height;
          height = COMPRESSION_SETTINGS.maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Create MediaRecorder
        const stream = canvas.captureStream(30); // 30 FPS
        const audioContext = new AudioContext();

        // Try to get audio from video
        let mediaStream = stream;
        try {
          const source = audioContext.createMediaElementSource(video);
          const dest = audioContext.createMediaStreamDestination();
          source.connect(dest);

          // Combine video and audio tracks
          const audioTrack = dest.stream.getAudioTracks()[0];
          if (audioTrack) {
            mediaStream = new MediaStream([
              ...stream.getVideoTracks(),
              audioTrack,
            ]);
          }
        } catch (e) {
          console.log("No audio track or audio processing failed");
        }

        const chunks = [];
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : "video/webm";

        const mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: mimeType,
          videoBitsPerSecond: COMPRESSION_SETTINGS.targetBitrate,
        });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".webm"),
            {
              type: mimeType,
            }
          );

          audioContext.close();
          resolve(compressedFile);
        };

        // Start recording
        mediaRecorder.start();
        video.play();

        // Draw frames
        const drawFrame = () => {
          if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, width, height);
            requestAnimationFrame(drawFrame);
          }
        };
        drawFrame();

        // Stop when video ends
        video.onended = () => {
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };

    video.src = URL.createObjectURL(file);
  });
};

// ✅ Simpler compression using canvas and lower quality
const compressVideoSimple = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;

    video.onloadedmetadata = async () => {
      try {
        // If video is already small, skip compression
        if (file.size < 10 * 1024 * 1024) {
          // Less than 10MB
          resolve(file);
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate dimensions
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
        const stream = canvas.captureStream(25); // 25 FPS for better compression

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
  // Reset errors
  videoUpload.errors = [];

  // ✅ Check total count with dynamic limit
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

    // Validate format
    const errors = validateVideo(file);
    if (errors.length > 0) {
      videoUpload.errors.push(...errors);
      continue;
    }

    try {
      // ✅ Compress video
      const compressedFile = await compressVideoSimple(file);

      // Check size after compression
      if (compressedFile.size > MAX_SIZE) {
        videoUpload.errors.push(
          `${file.name}: Video masih terlalu besar setelah kompresi (maksimal 50MB)`
        );
        continue;
      }

      // Create preview
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

      // Add compressed file
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

  // Show errors if any
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
  // ✅ Validation message with dynamic limit
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

    console.log("Uploading videos:", {
      invitation_id: props.invitationId,
      files_count: videoUpload.files.length,
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
    console.error("Failed to upload videos:", error.validationErrors);

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
  <div v-if="ui.isLoading" class="text-center py-8">
    <div
      class="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>
      <p>Memuat galeri video...</p>
    </div>
  </div>

  <div v-else>
    <!-- Package Restriction Notice -->
    <div
      v-if="!allowsVideos"
      class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center mb-8 border-2 border-amber-200 dark:border-amber-800"
    >
      <i
        class="bi bi-lock-fill text-6xl text-amber-400 dark:text-amber-600"
      ></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">
        Fitur Video Tidak Tersedia
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Paket Anda saat ini tidak mendukung penambahan video. Upgrade paket
        untuk menggunakan fitur ini.
      </p>
    </div>

    <template v-else>
      <!-- Compression Progress -->
      <div
        v-if="videoUpload.isCompressing"
        class="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 dark:text-white">
              Mengkompresi Video...
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ videoUpload.currentCompressingFile }}
            </p>
          </div>
          <span class="text-2xl font-bold text-blue-600">
            {{ videoUpload.compressionProgress }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${videoUpload.compressionProgress}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          💡 Video sedang dikompresi untuk menghemat ruang penyimpanan dan
          mempercepat upload
        </p>
      </div>

      <!-- Video Grid -->
      <div v-if="videos.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Galeri Video ({{ videos.length
            }}{{ hasVideoLimit ? ` / ${MAX_VIDEOS}` : "" }})
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(video, index) in videos"
            :key="video.id"
            class="group relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer"
          >
            <!-- Video Thumbnail or Poster -->
            <video
              v-if="video.video_url"
              :src="video.video_url"
              class="w-full h-full object-cover"
              preload="metadata"
            ></video>
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700"
            >
              <i class="bi bi-play-circle text-6xl text-gray-500"></i>
            </div>

            <!-- Play Icon Overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300"
            >
              <button
                @click="openVideoPlayer(index)"
                class="h-16 w-16 bg-white/90 text-blue-600 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
              >
                <i class="bi bi-play-fill text-3xl ml-1"></i>
              </button>
            </div>

            <!-- Action Buttons -->
            <div
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
            >
              <button
                @click.stop="openVideoPlayer(index)"
                class="h-10 aspect-square bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl hover:scale-110 transition-transform"
                title="Putar"
              >
                <i class="bi bi-play-fill"></i>
              </button>
              <button
                @click.stop="openDeleteModal(video)"
                class="h-10 aspect-square bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-xl hover:scale-110 transition-transform"
                title="Hapus"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>

            <!-- Video Info -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3"
            >
              <p class="text-sm font-medium truncate">Video {{ index + 1 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center mb-8 border-2 border-dashed border-blue-200 dark:border-blue-800"
      >
        <i
          class="bi bi-camera-video text-6xl text-blue-300 dark:text-blue-700"
        ></i>
        <h3
          class="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4"
        >
          Belum Ada Video
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Tambahkan video menarik untuk galeri acara Anda
        </p>
      </div>

      <!-- Add Form Toggle Button -->
      <div class="mb-6">
        <button
          @click="toggleForm"
          class="w-full px-6 py-3 bg-gradient-to-r text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          :class="
            ui.showForm
              ? 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              : 'from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
          "
        >
          <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
          {{ ui.showForm ? "Batal" : "Tambah Video" }}
        </button>
      </div>

      <!-- Upload Form -->
      <div v-if="ui.showForm">
        <div class="mb-6">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <i class="bi bi-camera-video text-blue-500"></i>
            Unggah Video
            <span v-if="hasVideoLimit"
              >(Maksimal {{ maxVideosText }} video)</span
            >
            <span v-else>(Tidak Terbatas)</span>
          </h3>
          <p class="text-sm text-blue-600 dark:text-blue-400 mt-2">
            ✨ Video akan otomatis dikompresi untuk hasil terbaik
          </p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Drop Zone -->
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300',
              videoUpload.isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600',
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
              <i
                class="bi bi-cloud-arrow-up text-6xl text-gray-400 dark:text-gray-600 mb-4"
              ></i>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Seret & Lepas video di sini
              </h4>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                atau klik tombol di bawah untuk memilih video
              </p>
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                <i class="bi bi-folder2-open mr-2"></i>
                Pilih Video
              </button>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Format: MP4, WEBM, OGG, MOV • Maks 100MB setelah kompresi •
                {{ remainingSlotsText }}
              </p>
            </div>

            <div
              v-else-if="videoUpload.isCompressing"
              class="text-gray-600 dark:text-gray-400"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
              ></div>
              <p>Sedang mengkompresi video...</p>
            </div>

            <div v-else class="text-gray-600 dark:text-gray-400">
              <i
                class="bi bi-check-circle-fill text-4xl text-green-500 mb-2"
              ></i>
              <p>Maksimal {{ maxVideosText }} video tercapai</p>
            </div>
          </div>

          <!-- Preview Grid -->
          <div v-if="videoUpload.previews.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-900 dark:text-white">
                Preview ({{ videoUpload.previews.length }} video)
              </h4>
              <button
                type="button"
                @click="clearAllVideos"
                :disabled="videoUpload.isCompressing"
                class="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
              >
                <i class="bi bi-x-circle mr-1"></i>
                Hapus Semua
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(preview, index) in videoUpload.previews"
                :key="preview.id"
                class="group relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
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
                  class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all disabled:opacity-50"
                  title="Hapus"
                >
                  <i class="bi bi-trash-fill text-sm"></i>
                </button>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-3"
                >
                  <p class="truncate font-medium">{{ preview.name }}</p>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-gray-300">
                      <i class="bi bi-file-earmark text-red-400"></i>
                      {{ preview.originalSize }} MB
                    </span>
                    <span class="text-green-400"> → </span>
                    <span class="text-green-300">
                      <i class="bi bi-file-earmark-check text-green-400"></i>
                      {{ preview.compressedSize }} MB
                    </span>
                  </div>
                  <div class="mt-1 text-center">
                    <span
                      class="bg-green-500/80 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
                    >
                      🎉 Hemat {{ preview.compressionRatio }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

          <div class="flex gap-4">
            <button
              type="button"
              @click="toggleForm"
              :disabled="ui.isSubmitting || videoUpload.isCompressing"
              class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-700 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="
                ui.isSubmitting || !isFormValid || videoUpload.isCompressing
              "
              class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              <span v-if="!ui.isSubmitting && !videoUpload.isCompressing">
                Unggah {{ videoUpload.files.length }} Video
              </span>
              <span
                v-else-if="videoUpload.isCompressing"
                class="flex items-center justify-center gap-2"
              >
                <div
                  class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                ></div>
                Mengkompresi...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <Spinner />
                Mengunggah...
              </span>
            </button>
          </div>
        </form>
      </div>
    </template>

    <!-- Next Button -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        @click="handleNext"
        :disabled="videoUpload.isCompressing"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Lanjutkan
        <i class="bi bi-arrow-right ml-2"></i>
      </button>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
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
        class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
      >
        <i class="bi bi-x-lg"></i>
      </button>

      <button
        @click.stop="prevVideo"
        class="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <button
        @click.stop="nextVideo"
        class="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

      <video
        v-if="videos[videoPlayer.currentIndex]"
        :src="videos[videoPlayer.currentIndex].video_url"
        @click.stop
        class="max-w-full max-h-full rounded-lg"
        controls
        autoplay
      ></video>

      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full"
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
          class="w-full h-48 object-cover rounded-lg mt-4"
          preload="metadata"
        ></video>
      </template>
    </ConfirmDeleteModal>
  </div>
</template>
