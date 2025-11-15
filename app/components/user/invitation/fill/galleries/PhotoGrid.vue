<script setup>
const props = defineProps({
  galleries: { type: Array, required: true },
});

const emit = defineEmits(["view", "delete"]);

const handleView = (index) => {
  emit("view", index);
};

const handleDelete = (gallery) => {
  emit("delete", gallery);
};
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
    <div
      v-for="(gallery, index) in galleries"
      :key="gallery.id"
      class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer"
    >
      <img
        :src="gallery.image_url"
        :alt="`Gallery ${index + 1}`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        @click="handleView(index)"
      />

      <!-- Overlay on hover -->
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
      >
        <div
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
        >
          <button
            @click.stop="handleView(index)"
            class="w-10 h-10 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center"
            title="Lihat"
          >
            <i class="bi bi-eye-fill"></i>
          </button>
          <button
            @click.stop="handleDelete(gallery)"
            class="w-10 h-10 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center"
            title="Hapus"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>