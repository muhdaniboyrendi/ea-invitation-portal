<template>
  <div class="relative">
    <!-- Header container -->
    <div
      class="relative p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
    >
      <div class="flex items-center justify-between">
        <!-- Title Section -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20"
            >
              <i class="bi bi-envelope text-white text-xl"></i>
            </div>
            <!-- Enhanced glow effect -->
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-xl animate-pulse-slow"
            ></div>
          </div>

          <div class="flex flex-col">
            <h2
              class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
            >
              Daftar Undangan
            </h2>
          </div>
        </div>

        <NuxtLink
          to="/invitation/create"
          class="px-6 py-3 font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Buat Undangan Baru
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
