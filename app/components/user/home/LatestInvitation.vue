<template>
  <div class="relative">
    <!-- Main container -->
    <div
      class="relative bg-white/80 dark:bg-dark/80 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
    >
      <!-- Content -->
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <div
          class="inline-flex items-center px-4 py-2 mt-4 mb-8 md:mt-0 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-full shadow-lg"
        >
          <span
            class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"
          ></span>
          <span class="text-sm font-medium text-dark/90 dark:text-white/90"
            >Undangan Terbaru</span
          >
        </div>

        <div>
          <UserInvitationCard />
        </div>

        <NuxtLink
          to="/"
          class="block mb-4 mt-8 md:mt-10 w-fit mx-auto font-semibold py-3 px-6 rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 text-white hover:scale-103 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
        >
          <i class="bi bi-envelope-paper mr-2"></i>
          Lihat Semua Undangan
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
