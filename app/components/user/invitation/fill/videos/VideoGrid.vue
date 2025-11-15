<script setup>
const props = defineProps({
  videos: { type: Array, required: true },
});

const emit = defineEmits(["play", "delete"]);

const handlePlay = (index) => {
  emit("play", index);
};

const handleDelete = (video) => {
  emit("delete", video);
};
</script>

<template>
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
          @click="handlePlay(index)"
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
          @click.stop="handlePlay(index)"
          class="w-9 h-9 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center"
          title="Putar"
        >
          <i class="bi bi-play-fill text-sm"></i>
        </button>
        <button
          @click.stop="handleDelete(video)"
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
</template>