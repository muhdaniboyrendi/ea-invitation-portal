<script setup>
const props = defineProps({
  invitationData: {
    type: Object,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  isFormValid: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "reset"]);

const handleSubmit = () => {
  emit("submit");
};

const handleReset = () => {
  emit("reset");
};
</script>

<template>
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 md:p-8">
    <!-- Summary Card -->
    <div
      class="bg-white dark:bg-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6"
    >
      <h3
        class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
      >
        <i class="bi bi-card-checklist text-blue-500"></i>
        Ringkasan Undangan
      </h3>
      <div class="space-y-3">
        <div
          class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
        >
          <span class="text-gray-600 dark:text-gray-400 text-sm"
            >Tema Dipilih</span
          >
          <span class="font-medium text-gray-900 dark:text-white">
            {{
              invitationData.theme_id ? "✓ Sudah dipilih" : "✗ Belum dipilih"
            }}
          </span>
        </div>
        <div
          class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
        >
          <span class="text-gray-600 dark:text-gray-400 text-sm"
            >Mempelai Pria</span
          >
          <span class="font-medium text-gray-900 dark:text-white">
            {{ invitationData.groom || "-" }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-gray-600 dark:text-gray-400 text-sm"
            >Mempelai Wanita</span
          >
          <span class="font-medium text-gray-900 dark:text-white">
            {{ invitationData.bride || "-" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 pt-6">
      <button
        type="button"
        @click="handleReset"
        :disabled="isSubmitting"
        class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
        Reset Form
      </button>
      <button
        type="button"
        @click="handleSubmit"
        :disabled="isSubmitting || !isFormValid"
        class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        <span v-if="!isSubmitting" class="flex items-center gap-2">
          <i class="bi bi-check-circle-fill"></i>
          Buat Undangan
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <Spinner />
          Membuat Undangan...
        </span>
      </button>
    </div>
  </div>
</template>
