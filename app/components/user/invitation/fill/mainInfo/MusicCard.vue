<script setup>
// Props
const props = defineProps({
  music: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  isAudioLoading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["select", "play"]);

// Handlers
const handleSelect = () => {
  if (!props.disabled) {
    emit("select", props.music);
  }
};

const handlePlay = (e) => {
  e.stopPropagation();
  if (!props.disabled) {
    emit("play", props.music);
  }
};
</script>

<template>
  <div
    @click="handleSelect"
    :class="[
      'cursor-pointer transition-all duration-300',
      disabled ? 'opacity-50 pointer-events-none' : '',
    ]"
  >
    <div
      class="relative bg-white dark:bg-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl"
    >
      <div class="flex items-center gap-4 p-4">
        <!-- Thumbnail Section -->
        <div class="relative flex-shrink-0">
          <div class="relative">
            <!-- Image -->
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

            <!-- Placeholder -->
            <div
              v-else
              class="w-16 h-16 rounded-xl border border-gray-200 dark:border-white/10 flex flex-col justify-center items-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-500 dark:text-gray-600"
            >
              <i class="bi bi-music-note text-3xl"></i>
            </div>

            <!-- Selected Badge -->
            <div v-if="isSelected" class="absolute -top-1 -left-1 z-10">
              <div
                class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
              >
                <i class="bi bi-check-lg text-white text-xs font-bold"></i>
              </div>
            </div>

            <!-- Playing Badge -->
            <div v-if="isPlaying" class="absolute -top-1 -right-1 z-10">
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
          >
            {{ music.name || "Untitled" }}
          </h4>
          <p
            class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 flex items-center gap-1"
          >
            <i class="bi bi-person-fill text-xs"></i>
            <span>{{ music.artist || "Unknown Artist" }}</span>
          </p>

          <!-- Now Playing Indicator -->
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

        <!-- Play Button -->
        <div class="flex-shrink-0">
          <button
            type="button"
            @click="handlePlay"
            :disabled="isAudioLoading"
            class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center shadow-md transform hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            <i v-if="!isPlaying" class="bi bi-play-fill text-lg ml-0.5"></i>
            <i v-else class="bi bi-pause-fill text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
