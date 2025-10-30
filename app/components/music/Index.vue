<script setup>
const { user } = storeToRefs(useAuthStore());
const { musics, musicsPending } = storeToRefs(useMusicStore());
const { deleteMusic, musicsRefresh } = useMusicStore();

// Audio player state
const currentPlayingId = ref(null);
const audioPlayer = ref(null);
const isLoading = ref(false);

// Delete modal state
const showDeleteModal = ref(false);
const musicToDelete = ref(null);
const isDeleting = ref(false);

// Notification state
const notification = reactive({
  show: false,
  type: "info",
  message: "",
  position: "top-center",
});

const showNotification = (type, message, position) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
  notification.position = position;
};

const closeNotification = () => {
  notification.show = false;
};

// Check if music is currently playing
const isPlaying = (musicId) => {
  return currentPlayingId.value === musicId;
};

// Play music
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
      currentPlayingId.value = null;
    });

    // Handle errors
    audioPlayer.value.addEventListener("error", (e) => {
      showNotification("error", "Gagal memutar musik. File tidak ditemukan.");
      currentPlayingId.value = null;
    });

    // Play new music
    isLoading.value = true;
    await audioPlayer.value.play();
    currentPlayingId.value = music.id;
    showNotification(
      "info",
      `Memutar: ${music.name} - ${music.artist}`,
      "bottom-right"
    );
  } catch (error) {
    console.error("Error playing music:", error);
    showNotification("error", "Gagal memutar musik. Silakan coba lagi.");
    currentPlayingId.value = null;
  } finally {
    isLoading.value = false;
  }
};

const pauseMusic = (music) => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    currentPlayingId.value = null;
  }
};

const handleEditMusic = (music) => {
  navigateTo(`/musics/${music.id}`);
};

const openDeleteModal = (music) => {
  musicToDelete.value = music;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  musicToDelete.value = null;
};

const handleDeleteMusic = async () => {
  if (!musicToDelete.value) return;

  isDeleting.value = true;
  try {
    await deleteMusic(musicToDelete.value.id);

    // Stop playing if deleted music is currently playing
    if (currentPlayingId.value === musicToDelete.value.id) {
      pauseMusic(musicToDelete.value);
    }

    closeDeleteModal();
    showNotification("success", "Musik berhasil dihapus! 🎉", "top-center");

    setTimeout(() => {
      musicsRefresh();
    }, 3000);
  } catch (error) {
    console.error("Error deleting music:", error);
    closeDeleteModal();
    showNotification(
      "error",
      `Gagal menghapus musik. ${error.message || "Silakan coba lagi."}`
    );
  } finally {
    isDeleting.value = false;
  }
};

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
});
</script>

<template>
  <div class="space-y-6">
    <Header
      title="Daftar Musik"
      button-text="Tambah Musik"
      :has-button="user?.role === 'admin'"
      button-link="/musics/create"
      icon="bi-music-note-list"
    />

    <!-- Popup Alert Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      :position="notification.position"
      :duration="3000"
      @close="closeNotification"
    />

    <div class="px-4 md:px-6">
      <!-- Loading State -->
      <div
        v-if="musicsPending"
        class="flex flex-col items-center justify-center py-16 px-4"
      >
        <!-- Loading Spinner -->
        <div class="relative mb-6">
          <div
            class="w-16 h-16 border-4 border-sky-200 dark:border-sky-900/30 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"
          ></div>
        </div>

        <!-- Loading Text -->
        <h3
          class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3"
        >
          Memuat Musik...
        </h3>

        <p class="text-slate-600 dark:text-slate-300 text-center max-w-md">
          Mohon tunggu sebentar, kami sedang memuat daftar musik untuk Anda.
        </p>
      </div>

      <!-- Empty State -->
      <div v-else-if="musics.length === 0" class="text-center py-20">
        <div
          class="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center"
        >
          <i
            class="bi bi-music-note-list text-4xl text-slate-400 dark:text-slate-600"
          ></i>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Belum Ada Musik
        </h3>
        <p
          v-if="user?.role === 'admin'"
          class="text-slate-600 dark:text-slate-300 mb-6"
        >
          Koleksi musik masih kosong. Tambahkan musik pertama Anda!
        </p>
        <NuxtLink
          v-if="user?.role === 'admin'"
          to="/musics/create"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <i class="bi bi-plus-lg"></i>
          Tambah Musik
        </NuxtLink>
      </div>

      <!-- Music Grid -->
      <div v-else class="grid gap-4">
        <MusicCard
          v-for="music in musics"
          :key="music.id"
          :music="music"
          :is-playing="isPlaying(music.id)"
          :is-loading="isLoading"
          @play="playMusic"
          @pause="pauseMusic"
          @edit="handleEditMusic"
          @delete="openDeleteModal"
        />
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Musik?"
      :message="`Apakah Anda yakin ingin menghapus musik ${musicToDelete?.name}`"
      :item-name="musicToDelete?.title"
      :is-deleting="isDeleting"
      type="danger"
      @close="closeDeleteModal"
      @confirm="handleDeleteMusic"
    >
      <p class="text-sm text-center text-slate-600 dark:text-slate-300 italic">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </ConfirmDeleteModal>
  </div>
</template>
