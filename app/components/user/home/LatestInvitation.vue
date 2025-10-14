<template>
  <div class="relative">
    <!-- Main container -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-6 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
    >
      <!-- Content -->
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <div
          class="inline-flex items-center px-4 py-2 mt-4 md:mt-0 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-full shadow-lg"
        >
          <span
            class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"
          ></span>
          <span class="text-sm font-medium text-dark/90 dark:text-white/90"
            >Undangan Anda</span
          >
        </div>

        <h2
          class="text-2xl md:text-3xl font-bold text-dark dark:text-white mt-6 mb-4"
        >
          Kelola Undangan Anda
        </h2>

        <p class="text-dark/70 dark:text-white/70 mb-8 text-sm md:text-base">
          Personalisasi dan bagikan undangan Anda dengan mudah
        </p>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <!-- Pengisian Data -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 border border-blue-400/30 dark:border-blue-400/40 hover:border-blue-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"
              >
                <i class="bi bi-pencil-square text-blue-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-dark dark:text-white mb-1">
                  Pengisian Data
                </h3>
                <p class="text-sm text-dark/60 dark:text-white/60">
                  Isi informasi lengkap acara Anda seperti tanggal, waktu,
                  tempat, dan deskripsi acara
                </p>
              </div>
            </div>
          </div>

          <!-- Kelola Tema -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/20 border border-purple-400/30 dark:border-purple-400/40 hover:border-purple-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"
              >
                <i class="bi bi-palette text-purple-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-dark dark:text-white mb-1">
                  Kelola Tema
                </h3>
                <p class="text-sm text-dark/60 dark:text-white/60">
                  Pilih dan sesuaikan tema, warna, font, dan tata letak sesuai
                  gaya Anda
                </p>
              </div>
            </div>
          </div>

          <!-- Kelola Tamu -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 border border-emerald-400/30 dark:border-emerald-400/40 hover:border-emerald-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"
              >
                <i class="bi bi-people text-emerald-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-dark dark:text-white mb-1">
                  Kelola Tamu
                </h3>
                <p class="text-sm text-dark/60 dark:text-white/60">
                  Tambah, edit, atau hapus daftar tamu dan pantau status
                  konfirmasi kehadiran
                </p>
              </div>
            </div>
          </div>

          <!-- Bagikan Undangan -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 dark:from-orange-500/20 dark:to-orange-600/20 border border-orange-400/30 dark:border-orange-400/40 hover:border-orange-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center"
              >
                <i class="bi bi-share-fill text-orange-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-dark dark:text-white mb-1">
                  Bagikan Undangan
                </h3>
                <p class="text-sm text-dark/60 dark:text-white/60">
                  Bagikan via link, WhatsApp, email, atau media sosial dengan
                  mudah
                </p>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink
          to="/invitation"
          class="inline-flex items-center justify-center w-fit font-semibold py-3 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
        >
          <i class="bi bi-envelope mr-2"></i>
          Lihat Daftar Undangan
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
