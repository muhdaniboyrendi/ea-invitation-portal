<template>
  <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 lg:p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden grid content-between gap-4"
    >
      <div>
        <div class="w-full flex items-center gap-4 mb-4">
          <div
            class="h-10 aspect-square rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 flex justify-center items-center"
          >
            <i class="bi bi-box-seam text-white text-xl"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold">
            Paket Undangan
          </h4>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Daftar paket undangan yang tersedia.
        </p>
      </div>
      <NuxtLink
        to="/packages"
        class="py-3 px-6 w-fit h-fit rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition duration-300"
      >
        Lihat Paket
        <i class="bi bi-arrow-right ml-1"></i>
      </NuxtLink>
    </div>

    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 lg:p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden grid content-between gap-4"
    >
      <div>
        <div class="w-full flex items-center gap-4 mb-4">
          <div
            class="h-10 aspect-square rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 flex justify-center items-center"
          >
            <i class="bi bi-palette2 text-white text-xl"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold">Galeri Tema</h4>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Daftar tema yang tersedia.
        </p>
      </div>
      <NuxtLink
        to="/themes"
        class="py-3 px-6 w-fit rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition duration-300"
      >
        Lihat Tema
        <i class="bi bi-arrow-right ml-1"></i>
      </NuxtLink>
    </div>

    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 lg:p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden grid content-between gap-4"
    >
      <div>
        <div class="w-full flex items-center gap-4 mb-4">
          <div
            class="h-10 aspect-square rounded-2xl bg-linear-to-r from-green-500 to-teal-500 flex justify-center items-center"
          >
            <i class="bi bi-music-note-list text-white text-xl"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold">
            Latar Belakang Musik
          </h4>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Daftar musik latar belakang undangan yang tersedia.
        </p>
      </div>
      <NuxtLink
        to="/musics"
        class="py-3 px-6 w-fit rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-center font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105 transition duration-300"
      >
        Lihat Musik
        <i class="bi bi-arrow-right ml-1"></i>
      </NuxtLink>
    </div>
  </div>
</template>
