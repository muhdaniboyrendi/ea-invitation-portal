<script setup>
const props = defineProps(["package"]);

const isProcessing = ref(false);

const promoCode = ref("");

const applyPromo = () => {
  if (promoCode.value.toLowerCase() === "discount10") {
    cart.value.subtotal = cart.value.subtotal * 0.9;
    cart.value.tax = cart.value.subtotal * 0.1;
    cart.value.total =
      cart.value.subtotal + cart.value.tax + cart.value.adminFee;
    alert("Promo code applied! 10% discount");
    promoCode.value = "";
  } else if (promoCode.value) {
    alert("Invalid promo code");
  }
};

const submitOrder = async () => {
  isProcessing.value = true;

  // Simulate API call
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success modal
    showSuccessModal.value = true;
    isProcessing.value = false;

    console.log("Order submitted:", {
      customer: customerInfo.value,
      cart: cart.value,
      paymentMethod: selectedPayment.value,
    });
  } catch (error) {
    console.error("Order submission failed:", error);
    isProcessing.value = false;
    alert("Terjadi kesalahan. Silakan coba lagi.");
  }
};
</script>

<template>
  <div class="space-y-4">
    <!-- Promo Code -->
    <div
      class="bg-white dark:bg-dark rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
    >
      <div class="relative p-4">
        <div class="flex space-x-3">
          <input
            v-model="promoCode"
            type="text"
            class="flex-1 px-4 py-3 text-dark/80 dark:text-white/80 rounded-xl bg-off-white dark:bg-gray-900 border border-dark/10 dark:border-gray-700/30 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
            placeholder="Masukkan kode promo"
          />
          <button
            @click="applyPromo"
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25 hover:scale-105"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>

    <!-- Order Button -->
    <button
      @click="submitOrder"
      :disabled="isProcessing"
      class="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-103 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60"
      :class="
        isProcessing
          ? 'bg-gray-400 text-gray-200'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-2xl shadow-blue-500/25'
      "
    >
      <!-- Loading Spinner -->
      <div
        v-if="isProcessing"
        class="flex items-center justify-center space-x-3"
      >
        <div
          class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></div>
        <span>Memproses Pesanan...</span>
      </div>
      <div v-else class="flex items-center justify-center space-x-3">
        <i class="bi bi-credit-card text-xl"></i>
        <span>Bayar Sekarang - Rp {{ formatRupiah(props.package.price) }}</span>
      </div>

      <!-- Hover Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
      ></div>
    </button>
  </div>
</template>
