<script setup>
const { createPayment, updatePaymentSuccess } = usePaymentStore();
const { $midtrans } = useNuxtApp();
const router = useRouter();

const props = defineProps(["package"]);

const isProcessing = ref(false);
const promoCode = ref("");
const showSuccessAlert = ref(false);

const finalPrice = Number(props.package.final_price) + 2500;

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
  try {
    isProcessing.value = true;

    const orderData = await createPayment(props.package.id);

    if (orderData.data?.snap_token) {
      $midtrans.openSnapPayment(orderData.data.snap_token, {
        onSuccess: (result) => handlePaymentSuccess(result),
        onPending: (result) => handlePaymentPending(result),
        onClose: () => handlePaymentClosed(),
      });
    } else {
      console.error("No snap token received");
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    console.error("Error validation:", error.validationErrors);
  } finally {
    isProcessing.value = false;
  }
};

const handlePaymentSuccess = async (result) => {
  try {
    await updatePaymentSuccess(result.order_id);

    showSuccessAlert.value = true;

    setTimeout(() => {
      showSuccessAlert.value = false;
      router.push(`/dashboard/invitation/create/${result.order_id}`);
    }, 3000);
  } catch (error) {
    console.error(error);
    console.error(error.validationErrors);
  }
};

const handlePaymentPending = async (result) => {
  router.push(`/invitation/create/checkout/success/${result.order_id}`);
};

const handlePaymentClosed = () => {
  console.log("Pembayaran ditutup tanpa menyelesaikan transaksi");
};
</script>

<template>
  <div class="space-y-4">
    <!-- Success Alert Modal -->
    <UserInvitationCheckoutPaymentSuccessModal v-if="showSuccessAlert" />

    <!-- Order Button -->
    <button
      @click="submitOrder"
      :disabled="isProcessing"
      class="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60"
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
        <span>Bayar Sekarang - Rp {{ formatRupiah(finalPrice) }}</span>
      </div>

      <!-- Hover Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
      ></div>
    </button>
  </div>
</template>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale In Animation */
@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

/* Progress Bar Animation */
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(500%);
  }
}

.animate-progress {
  animation: progress 5s ease-in-out forwards;
}
</style>
