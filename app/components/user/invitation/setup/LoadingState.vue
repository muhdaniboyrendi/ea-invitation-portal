<template>
  <div
    class="p-8 md:p-12 rounded-3xl bg-off-white dark:bg-gray-900 shadow-xl flex justify-center"
  >
    <div class="flex flex-col items-center justify-center py-16 px-4">
      <!-- Loading Spinner -->
      <div class="relative mb-6">
        <div
          class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Loading Text -->
      <h3 class="text-xl font-semibold text-dark dark:text-white mb-3">
        Memeriksa Undangan...
      </h3>

      <p class="text-dark/60 dark:text-white/60 text-center max-w-md">
        Mohon tunggu sebentar, kami sedang memeriksa undangan anda.
      </p>
    </div>
  </div>
</template>
