<script setup>
const props = defineProps({
  music: {
    type: Object,
    required: true,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["play", "pause", "edit", "delete"]);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const handlePlayPause = () => {
  if (props.isPlaying) {
    emit("pause", props.music);
  } else {
    emit("play", props.music);
  }
};

const handleEdit = () => {
  emit("edit", props.music);
};

const handleDelete = () => {
  emit("delete", props.music);
};
</script>

<template>
  <div class="group relative w-full">
    <!-- Horizontal Music Card -->
    <div
      class="relative bg-white dark:bg-dark border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
    >
      <div class="flex items-center gap-4 p-4">
        <!-- Thumbnail Section (Left) -->
        <div class="relative flex-shrink-0">
          <!-- Thumbnail Image -->
          <div class="relative">
            <NuxtImg
              v-if="music.thumbnail_url"
              :src="music.thumbnail_url"
              :alt="music.title"
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

            <!-- Play/Pause Overlay Button -->
            <button
              @click="handlePlayPause"
              :disabled="isLoading"
              class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl disabled:cursor-not-allowed"
            >
              <div
                class="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300"
                :class="isPlaying ? 'animate-pulse' : ''"
              >
                <i
                  v-if="!isPlaying"
                  class="bi bi-play-fill text-xl text-blue-600 dark:text-blue-400 ml-0.5"
                ></i>
                <i
                  v-else
                  class="bi bi-pause-fill text-xl text-blue-600 dark:text-blue-400"
                ></i>
              </div>
            </button>

            <!-- Duration Badge -->
            <div
              v-if="music.duration"
              class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold"
            >
              {{ music.duration }}
            </div>
          </div>

          <!-- Playing Indicator (On Thumbnail) -->
          <div v-if="isPlaying" class="absolute -top-1 -left-1 z-10">
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

        <!-- Music Info Section (Center) -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-1">
            <div class="flex-1 min-w-0">
              <h3
                class="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-0.5 line-clamp-1"
                :title="music.name"
              >
                {{ music.name || "Untitled" }}
              </h3>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 flex items-center gap-1"
                :title="music.artist"
              >
                <i class="bi bi-person-fill text-xs"></i>
                <span>{{ music.artist || "Unknown Artist" }}</span>
              </p>
            </div>
          </div>

          <!-- Playing Status Text -->
          <div v-if="isPlaying" class="flex items-center gap-1.5 mt-2">
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

        <!-- Action Buttons Section (Right) -->
        <div class="flex-shrink-0 flex items-center gap-2">
          <!-- Play/Pause Button (Always Visible) -->
          <button
            @click="handlePlayPause"
            :disabled="isLoading"
            class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <i v-if="!isPlaying" class="bi bi-play-fill text-lg ml-0.5"></i>
            <i v-else class="bi bi-pause-fill text-lg"></i>
          </button>

          <!-- Admin Actions -->
          <template v-if="user?.role === 'admin'">
            <button
              type="button"
              @click="handleEdit"
              class="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300"
            >
              <i class="bi bi-pencil-square text-sm"></i>
            </button>
            <button
              type="button"
              @click="handleDelete"
              class="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300"
            >
              <i class="bi bi-trash3 text-sm"></i>
            </button>
          </template>
        </div>
      </div>
    </div>
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
