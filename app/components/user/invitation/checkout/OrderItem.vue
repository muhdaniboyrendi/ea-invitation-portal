<script setup>
const props = defineProps(["package", "adminFee"]);
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/30 dark:border-slate-800/30 overflow-hidden"
  >
    <div class="relative p-6">
      <h2
        class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center"
      >
        <i class="bi bi-bag text-sky-500 dark:text-sky-400 mr-3"></i>
        Ringkasan Pesanan
      </h2>

      <div class="space-y-4">
        <div
          class="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/20 dark:border-slate-700/20 shadow-lg"
        >
          <div
            class="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/40 flex items-center justify-center overflow-hidden"
          >
            <i class="bi bi-box text-2xl text-sky-500 dark:text-sky-400"></i>
          </div>

          <div class="flex-1">
            <h3 class="font-semibold text-slate-900 dark:text-slate-50">
              Paket {{ props.package.name }}
            </h3>
            <div class="flex items-center mt-2 space-x-4">
              <span class="font-bold text-sky-600 dark:text-sky-400"
                >Rp {{ formatRupiah(props.package.price) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Price Summary -->
      <div
        class="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3"
      >
        <div class="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Diskon</span>
          <span>Rp {{ formatRupiah(props.package.discount) }}</span>
        </div>
        <div class="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Biaya Admin</span>
          <span>Rp {{ formatRupiah(props.adminFee) }}</span>
        </div>
        <div
          class="h-px bg-gradient-to-r from-transparent via-slate-200/50 dark:via-slate-800/50 to-transparent"
        ></div>
        <div
          class="flex justify-between text-xl font-bold text-slate-900 dark:text-slate-50"
        >
          <span>Total</span>
          <span class="text-sky-600 dark:text-sky-400"
            >Rp {{ formatRupiah(parseInt(props.package.final_price)) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
