<script setup>
const { packages, pending, error } = storeToRefs(usePackageStore());
</script>

<template>
  <div class="px-4 md:px-6"
  >
    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <!-- Loading Spinner -->
      <div class="relative mb-6">
        <div
          class="w-16 h-16 border-4 border-sky-200 dark:border-sky-900/30 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Loading Text -->
      <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
        Memuat Paket Undangan...
      </h3>

      <p class="text-slate-600 dark:text-slate-300 text-center max-w-md">
        Mohon tunggu sebentar, kami sedang memuat daftar paket undangan untuk
        Anda.
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="packages.length === 0" class="text-center py-20">
      <div
        class="w-20 h-20 mx-auto mb-6 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center"
      >
        <i
          class="bi bi-music-note-list text-4xl text-slate-400 dark:text-slate-600"
        ></i>
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
        Belum Ada Paket Undangan Tersedia
      </h3>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8"
    >
      <PackageCard v-for="pkg in packages" :key="pkg.id" :package="pkg" />
    </div>
  </div>
</template>
