<script setup>
const { user } = storeToRefs(useAuthStore());
const { musics, musicsPending } = storeToRefs(useMusicStore());

// Sample music data - replace with your actual API call
const musicList = ref([
  {
    id: 1,
    title: "Summer Vibes",
    artist: "The Sunset Band",
    thumbnail_url:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    audio_url: "/music/sample1.mp3",
    duration: "3:45",
    is_premium: true,
  },
  {
    id: 2,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    thumbnail_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    audio_url: "/music/sample2.mp3",
    duration: "4:20",
    is_premium: false,
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Coastal Harmony",
    thumbnail_url: null,
    audio_url: "/music/sample3.mp3",
    duration: "5:10",
    is_premium: false,
  },
  {
    id: 4,
    title: "City Lights",
    artist: "Urban Echo",
    thumbnail_url:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    audio_url: "/music/sample4.mp3",
    duration: "3:30",
    is_premium: true,
  },
]);

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
});

const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
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
    showNotification("success", `Memutar: ${music.title} - ${music.artist}`);
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
    const index = musicList.value.findIndex(
      (m) => m.id === musicToDelete.value.id
    );
    if (index !== -1) {
      musicList.value.splice(index, 1);
    }

    // Stop playing if deleted music is currently playing
    if (currentPlayingId.value === musicToDelete.value.id) {
      pauseMusic(musicToDelete.value);
    }

    closeDeleteModal();
    showNotification("success", "Musik berhasil dihapus! 🎉");
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
  <div class="grid gap-6">
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
      position="top-center"
      :duration="3000"
      @close="closeNotification"
    />

    <div
      class="relative p-6 md:p-8 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
    >
      <!-- Music Grid -->
      <div v-if="musics.length > 0" class="grid gap-4">
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

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div
          class="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center"
        >
          <i
            class="bi bi-music-note-list text-4xl text-gray-400 dark:text-gray-600"
          ></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Belum Ada Musik
        </h3>
        <p
          v-if="user?.role === 'admin'"
          class="text-gray-600 dark:text-gray-400 mb-6"
        >
          Koleksi musik masih kosong. Tambahkan musik pertama Anda!
        </p>
        <NuxtLink
          v-if="user?.role === 'admin'"
          to="/musics/create"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <i class="bi bi-plus-lg"></i>
          Tambah Musik
        </NuxtLink>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      title="Hapus Musik?"
      message="Apakah Anda yakin ingin menghapus musik"
      :item-name="musicToDelete?.title"
      :is-deleting="isDeleting"
      type="danger"
      @close="closeDeleteModal"
      @confirm="handleDeleteMusic"
    >
      <p class="text-sm text-center text-black/60 dark:text-white/60 italic">
        Tindakan ini tidak dapat dibatalkan.
      </p>
    </ConfirmDeleteModal>
  </div>
</template>
