<template>
  <div
    class="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/10 dark:border-slate-800/10 overflow-hidden"
  >
    <!-- Empty State Content -->
    <div class="relative p-8 sm:p-12">
      <!-- Illustration -->
      <div class="flex justify-center mb-6">
        <div
          class="w-24 h-24 rounded-full bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/40 flex items-center justify-center shadow-lg"
        >
          <i class="bi bi-wallet text-5xl text-sky-500 dark:text-sky-400"></i>
        </div>
      </div>

      <!-- Empty State Text -->
      <div class="text-center mb-8">
        <h3
          class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2"
        >
          Belum ada transaksi
        </h3>
        <p
          class="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-md mx-auto"
        >
          Anda belum melakukan pembelian paket undangan apapun. Mulai buat
          undangan Anda dengan memilih paket yang tersedia.
        </p>
      </div>

      <!-- CTA Button -->
      <div class="flex justify-center mb-8">
        <NuxtLink
          to="/invitation/create"
          class="px-6 sm:px-8 py-3 flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/60 hover:scale-105"
        >
          <i class="bi bi-plus-circle text-lg"></i>
          <span>Pilih Paket Sekarang</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
