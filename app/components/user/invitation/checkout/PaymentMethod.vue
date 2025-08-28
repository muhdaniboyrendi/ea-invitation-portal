<script setup>
const selectedPayment = ref("credit-card");

const paymentMethods = ref([
  {
    id: "credit-card",
    name: "Kartu Kredit/Debit",
    description: "Visa, Mastercard, dll",
    icon: "bi bi-credit-card",
  },
  {
    id: "bank-transfer",
    name: "Transfer Bank",
    description: "BCA, Mandiri, BNI, BRI",
    icon: "bi bi-bank",
  },
  {
    id: "e-wallet",
    name: "E-Wallet",
    description: "GoPay, OVO, DANA",
    icon: "bi bi-wallet",
  },
  {
    id: "qris",
    name: "QRIS",
    description: "Scan QR untuk bayar",
    icon: "bi bi-qr-code",
  },
]);
</script>

<template>
  <div
    class="backdrop-blur-2xl bg-white dark:bg-dark rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="relative p-6">
      <h2
        class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
      >
        <i class="bi bi-credit-card text-blue-600 dark:text-blue-400 mr-3"></i>
        Metode Pembayaran
      </h2>

      <div class="space-y-3">
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          @click="selectedPayment = method.id"
          class="flex items-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-md"
          :class="
            selectedPayment === method.id
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-300 dark:border-blue-600'
              : 'bg-off-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50/40 dark:hover:bg-gray-700/60'
          "
        >
          <div class="flex items-center space-x-4 flex-1">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center"
            >
              <i
                :class="method.icon"
                class="text-xl text-blue-600 dark:text-blue-400"
              ></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200">
                {{ method.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ method.description }}
              </p>
            </div>
          </div>
          <div
            class="w-5 h-5 rounded-full border-2 transition-all duration-300"
            :class="
              selectedPayment === method.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            "
          >
            <div
              v-if="selectedPayment === method.id"
              class="w-full h-full rounded-full bg-white scale-50"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
