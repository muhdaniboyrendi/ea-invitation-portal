<script setup>
const { packages, pending, error } = storeToRefs(usePackageStore());
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 sm:pt-8 md:p-8 md:pt-12 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <!-- Loading Spinner -->
      <div class="relative mb-6">
        <div
          class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Loading Text -->
      <h3 class="text-xl font-semibold text-dark dark:text-white mb-3">
        Memuat Paket Undangan...
      </h3>

      <p class="text-dark/60 dark:text-white/60 text-center max-w-md">
        Mohon tunggu sebentar, kami sedang memuat daftar paket undangan untuk
        Anda.
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="packages.length === 0" class="text-center py-20">
      <div
        class="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center"
      >
        <i
          class="bi bi-music-note-list text-4xl text-gray-400 dark:text-gray-600"
        ></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Belum Ada Paket Undangan Tersedia
      </h3>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-x-6 gap-y-8"
    >
      <PackageCard v-for="pkg in packages" :key="pkg.id" :package="pkg" />
    </div>
  </div>
</template>
