<script setup>
const props = defineProps({
  videos: { type: Array, required: true },
  currentIndex: { type: Number, required: true },
});

const emit = defineEmits(["close", "next", "prev"]);

const handleClose = () => {
  emit("close");
};

const handleNext = () => {
  emit("next");
};

const handlePrev = () => {
  emit("prev");
};
</script>

<template>
  <div
    @click="handleClose"
    class="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
  >
    <button
      @click="handleClose"
      class="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
    >
      <i class="bi bi-x-lg text-xl"></i>
    </button>

    <button
      @click.stop="handlePrev"
      class="absolute left-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
    >
      <i class="bi bi-chevron-left text-2xl"></i>
    </button>

    <button
      @click.stop="handleNext"
      class="absolute right-4 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
    >
      <i class="bi bi-chevron-right text-2xl"></i>
    </button>

    <video
      v-if="videos[currentIndex]"
      :src="videos[currentIndex].video_url"
      @click.stop
      class="max-w-full max-h-full rounded-2xl"
      controls
      autoplay
    ></video>

    <div
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
    >
      {{ currentIndex + 1 }} / {{ videos.length }}
    </div>
  </div>
</template>