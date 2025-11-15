<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchVideos, createVideos, deleteVideo } = useVideoStore();

const videos = ref([]);
const ui = reactive({
  isLoading: true,
  showForm: false,
});

const deleteModal = reactive({
  show: false,
  isDeleting: false,
  videoId: null,
  videoUrl: "",
  videoThumbnail: "",
});

const videoPlayer = reactive({
  show: false,
  currentIndex: 0,
});

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

// Form Handlers
const handleUploadSuccess = async (count) => {
  try {
    // Refresh data dari server
    await refreshData();

    // Tampilkan success message
    emit("success", `${count} video berhasil ditambahkan ke galeri!`);

    // Tutup form setelah semuanya selesai
    ui.showForm = false;
  } catch (error) {
    console.error("Error refreshing data:", error);
    emit(
      "error",
      "Video berhasil diupload, tapi gagal refresh galeri. Silakan refresh halaman."
    );
  }
};

const handleUploadError = (message) => {
  emit("error", message);
};

const toggleForm = () => {
  ui.showForm = !ui.showForm;
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

// Video Player Handlers
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

const handleNext = () => {
  emit("next");
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Loading State -->
  <UserInvitationFillVideosVideoGalleryLoading v-if="ui.isLoading" />

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Package Restriction Notice -->
    <UserInvitationFillVideosPackageRestrictionNotice v-if="!allowsVideos" />

    <template v-else>
      <!-- Video Header -->
      <UserInvitationFillVideosVideoGalleryHeader
        :video-count="videos.length"
        :max-videos="MAX_VIDEOS"
        :has-video-limit="hasVideoLimit"
      />

      <!-- Video Grid -->
      <UserInvitationFillVideosVideoGrid
        v-if="videos.length > 0"
        :videos="videos"
        @play="openVideoPlayer"
        @delete="openDeleteModal"
      />

      <!-- Empty State -->
      <UserInvitationFillVideosVideoEmptyState v-else />

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
      <UserInvitationFillVideosVideoUploadForm
        v-if="ui.showForm"
        :invitation-id="invitationId"
        :max-videos="MAX_VIDEOS"
        :max-videos-text="maxVideosText"
        :has-video-limit="hasVideoLimit"
        @success="handleUploadSuccess"
        @error="handleUploadError"
        @cancel="toggleForm"
      />
    </template>

    <!-- Next Button -->
    <div class="pt-2">
      <button
        @click="handleNext"
        class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Lanjutkan
        <i class="bi bi-arrow-right"></i>
      </button>
      <p class="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
        Galeri video bersifat opsional, Anda bisa melewatinya
      </p>
    </div>

    <!-- Video Player Modal -->
    <UserInvitationFillVideosVideoPlayerModal
      v-if="videoPlayer.show"
      :videos="videos"
      :current-index="videoPlayer.currentIndex"
      @close="closeVideoPlayer"
      @next="nextVideo"
      @prev="prevVideo"
    />

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
