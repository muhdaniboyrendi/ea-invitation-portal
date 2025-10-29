<template>
  <div class="relative">
    <!-- Main container -->
    <div
      class="relative bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl border border-slate-200/30 dark:border-slate-800/30 overflow-hidden"
    >
      <!-- Content -->
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <div
          class="inline-flex items-center px-4 py-2 mt-4 md:mt-0 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-slate-200/20 dark:border-slate-800/20 rounded-full shadow-lg"
        >
          <span
            class="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"
          ></span>
          <span class="text-sm font-medium text-slate-900/90 dark:text-slate-50/90"
            >Undangan Anda</span
          >
        </div>

        <h2
          class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-6 mb-4"
        >
          Kelola Undangan Anda
        </h2>

        <p class="text-slate-600 dark:text-slate-300 mb-8 text-sm md:text-base">
          Personalisasi dan bagikan undangan Anda dengan mudah
        </p>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <!-- Pengisian Data -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-600/10 dark:from-sky-500/20 dark:to-sky-600/20 border border-sky-400/30 dark:border-sky-400/40 hover:border-sky-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center"
              >
                <i class="bi bi-pencil-square text-sky-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                  Pengisian Data
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Isi informasi lengkap acara Anda seperti tanggal, waktu,
                  tempat, dan deskripsi acara
                </p>
              </div>
            </div>
          </div>

          <!-- Kelola Tema -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 border border-blue-400/30 dark:border-blue-400/40 hover:border-blue-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"
              >
                <i class="bi bi-palette text-blue-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                  Kelola Tema
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">
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
                <h3 class="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                  Kelola Tamu
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Tambah, edit, atau hapus daftar tamu dan pantau status
                  konfirmasi kehadiran
                </p>
              </div>
            </div>
          </div>

          <!-- Bagikan Undangan -->
          <div
            class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 border border-amber-400/30 dark:border-amber-400/40 hover:border-amber-400/60 transition-colors"
          >
            <div class="flex items-start gap-3 text-left">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"
              >
                <i class="bi bi-share-fill text-amber-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                  Bagikan Undangan
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Bagikan via link, WhatsApp, email, atau media sosial dengan
                  mudah
                </p>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink
          to="/invitation"
          class="inline-flex items-center justify-center w-fit font-semibold py-3 px-8 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:scale-105 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-300"
        >
          <i class="bi bi-envelope mr-2"></i>
          Lihat Daftar Undangan
        </NuxtLink>
      </div>
    </div>
  </div>
</template>