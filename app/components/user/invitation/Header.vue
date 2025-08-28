<template>
  <div class="relative">
    <!-- Main container -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
    >
      <!-- Content -->
      <div class="relative text-center flex justify-between items-center">
        <div
          class="inline-flex items-center px-4 py-2 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-full shadow-lg"
        >
          <span
            class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"
          ></span>
          <span class="text-sm font-medium text-dark/90 dark:text-white/90"
            >Daftar Undangan</span
          >
        </div>

        <NuxtLink
          to="/invitation/create"
          class="w-fit font-semibold py-3 px-6 rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 text-white hover:scale-103 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
        >
          Buat Undangan Baru
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
