<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-red-200 dark:border-red-800"
  >
    <div class="flex items-center gap-2 mb-4">
      <div
        class="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center"
      >
        <i class="bi bi-exclamation-triangle text-red-500"></i>
      </div>
      <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
        Zona Berbahaya
      </h4>
    </div>

    <div
      class="p-4 bg-red-50 dark:bg-red-950 rounded-2xl border border-red-200 dark:border-red-800"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
            Hapus Akun
          </p>
          <p class="text-xs text-slate-600 dark:text-slate-300">
            Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus
            permanen.
          </p>
        </div>
        <button
          class="flex-shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
        >
          Hapus Akun
        </button>
      </div>
    </div>
  </div>
</template>
