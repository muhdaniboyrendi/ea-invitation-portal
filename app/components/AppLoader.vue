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

<template>
  <div
    class="fixed inset-0 bg-slate-50 dark:bg-slate-950 z-50 flex items-center justify-center"
  >
    <div class="text-center">
      <!-- Loading spinner -->
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"
      ></div>

      <!-- Loading text -->
      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
        {{ title }}
      </h2>

      <p class="text-slate-600 dark:text-slate-300">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>
