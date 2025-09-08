<template>
  <div
    class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
  >
    <div class="text-center">
      <!-- Loading spinner -->
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>

      <!-- Loading text -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h2>

      <p class="text-gray-600 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Loading...",
  },
  subtitle: {
    type: String,
    default: "Please wait while we prepare your experience",
  },
});
</script>
