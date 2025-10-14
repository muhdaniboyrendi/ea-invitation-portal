<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
  >
    <!-- Empty State Content -->
    <div class="relative p-8 sm:p-12">
      <!-- Illustration -->
      <div class="flex justify-center mb-6">
        <div
          class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-lg"
        >
          <i class="bi bi-inbox text-5xl text-blue-400 dark:text-blue-300"></i>
        </div>
      </div>

      <!-- Empty State Text -->
      <div class="text-center mb-8">
        <h3
          class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2"
        >
          Belum ada undangan
        </h3>
        <p
          class="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto"
        >
          Anda belum membuat undangan pernikahan apapun. Mulai buat undangan
          pertama Anda sekarang!
        </p>
      </div>

      <!-- CTA Button -->
      <div class="flex justify-center mb-8 gap-4">
        <NuxtLink
          to="/invitation/create"
          class="px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
        >
          <i class="bi bi-plus-circle text-lg"></i>
          <span>Buat Undangan Sekarang</span>
        </NuxtLink>
        <NuxtLink
          to="/transaction"
          class="px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 border-2 border-blue-500 text-blue-500 dark:text-blue-400 rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
        >
          <span>Daftar Transaksi</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
