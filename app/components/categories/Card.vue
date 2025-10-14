<script setup>
const props = defineProps(["category"]);
const emit = defineEmits(["edit", "delete"]);

const handleEdit = (category) => {
  emit("edit", category);
};

const openDeleteModal = (category) => {
  emit("delete", category);
};
</script>

<template>
  <div
    class="group relative p-6 bg-white dark:bg-dark rounded-2xl border border-dark/10 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102"
  >
    <!-- Category Content -->
    <div
      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4"
    >
      <div class="flex-1">
        <h3 class="text-lg font-bold text-dark dark:text-white mb-2">
          {{ props.category.name }}
        </h3>
        <p class="text-dark/70 dark:text-white/70 text-sm leading-relaxed">
          {{ props.category.description || "-" }}
        </p>
      </div>

      <!-- Category Badge -->
      <span
        class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700/50 text-xs font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap"
      >
        <i class="bi bi-tag mr-1.5"></i>
        ID: {{ props.category.id }}
      </span>
    </div>

    <!-- Action Buttons -->
    <div
      class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dark/10 dark:border-white/10"
    >
      <!-- Edit Button -->
      <button
        @click="handleEdit(props.category)"
        class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/edit"
      >
        <i
          class="bi bi-pencil-square group-hover/edit:scale-110 transition-transform"
        ></i>
        <span class="hidden sm:inline">Edit</span>
      </button>

      <!-- Delete Button -->
      <button
        @click="openDeleteModal(props.category)"
        class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-red-500/90 to-rose-600/90 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/delete"
      >
        <i
          class="bi bi-trash group-hover/delete:scale-110 transition-transform"
        ></i>
        <span class="hidden sm:inline">Hapus</span>
      </button>
    </div>
  </div>
</template>
