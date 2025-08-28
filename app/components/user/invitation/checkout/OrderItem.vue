<script setup>
const props = defineProps(["package"]);
</script>

<template>
  <div
    class="backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20"
    ></div>

    <div class="relative p-6">
      <h2
        class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
      >
        <i class="bi bi-bag text-blue-600 dark:text-blue-400 mr-3"></i>
        Ringkasan Pesanan
      </h2>

      <div class="space-y-4">
        <div
          class="flex items-center space-x-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/20"
        >
          <div
            class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center overflow-hidden"
          >
            <i
              class="bi bi-card-text text-2xl text-blue-600 dark:text-blue-400"
            ></i>
          </div>

          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200">
              {{ props.package.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ props.package.description }}
            </p>
            <div class="flex items-center mt-2 space-x-4">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Qty: {{ props.package.quantity }}</span
              >
              <span class="font-bold text-blue-600 dark:text-blue-400"
                >Rp {{ formatRupiah(props.package.price * props.package.quantity) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Price Summary -->
      <div
        class="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3"
      >
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>Rp {{ formatRupiah(cart.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Pajak (10%)</span>
          <span>Rp {{ formatRupiah(cart.tax) }}</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Biaya Admin</span>
          <span>Rp {{ formatRupiah(cart.adminFee) }}</span>
        </div>
        <div
          class="h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent"
        ></div>
        <div
          class="flex justify-between text-xl font-bold text-gray-800 dark:text-gray-200"
        >
          <span>Total</span>
          <span class="text-blue-600 dark:text-blue-400"
            >Rp {{ formatRupiah(cart.total) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
