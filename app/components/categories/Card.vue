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
    class="group relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/10 dark:border-slate-800/10 hover:border-sky-300 dark:hover:border-sky-500/30 shadow-md hover:shadow-xl transition-all duration-300"
  >
    <!-- Category Content -->
    <div
      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4"
    >
      <div class="flex-1">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
          {{ props.category.name }}
        </h3>
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {{ props.category.description || "-" }}
        </p>
      </div>

      <!-- Category Badge -->
      <span
        class="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-700/50 text-xs font-medium text-sky-600 dark:text-sky-400 whitespace-nowrap"
      >
        <i class="bi bi-tag mr-1.5"></i>
        ID: {{ props.category.id }}
      </span>
    </div>

    <!-- Action Buttons -->
    <div
      class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/10 dark:border-slate-800/10"
    >
      <!-- Edit Button -->
      <button
        @click="handleEdit(props.category)"
        class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/edit"
      >
        <i
          class="bi bi-pencil-square group-hover/edit:scale-110 transition-transform"
        ></i>
        <span class="hidden sm:inline">Edit</span>
      </button>

      <!-- Delete Button -->
      <button
        @click="openDeleteModal(props.category)"
        class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/delete"
      >
        <i
          class="bi bi-trash group-hover/delete:scale-110 transition-transform"
        ></i>
        <span class="hidden sm:inline">Hapus</span>
      </button>
    </div>
  </div>
</template>
