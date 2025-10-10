<script setup>
const { packages, pending, error } = storeToRefs(usePackageStore());
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
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

    <div
      v-else-if="packages"
      class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-x-6 gap-y-8 mt-6"
    >
      <PackageCard v-for="pkg in packages" :key="pkg.id" :package="pkg" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
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
      <p
        v-if="user?.role === 'admin'"
        class="text-gray-600 dark:text-gray-400 mb-6"
      >
        Koleksi paket masih kosong. Tambahkan paket pertama Anda!
      </p>
      <NuxtLink
        v-if="user?.role === 'admin'"
        to="/musics/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <i class="bi bi-plus-lg"></i>
        Tambah Paket
      </NuxtLink>
    </div>
  </div>
</template>
