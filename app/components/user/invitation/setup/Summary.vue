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
    <!-- Action Buttons -->
    <div class="flex">
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
