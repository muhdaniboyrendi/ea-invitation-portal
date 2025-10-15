<script setup>
const { updatePaymentSuccess } = usePaymentStore();
const { $midtrans } = useNuxtApp();
const router = useRouter();

const props = defineProps(["snapToken"]);

const showSuccessAlert = ref(false);

const handlePayNow = () => {
  $midtrans.openSnapPayment(props.snapToken, {
    onSuccess: (result) => handlePaymentSuccess(result),
    onPending: (result) => handlePaymentPending(result),
    onClose: () => handlePaymentClosed(),
  });
};

const handlePaymentSuccess = async (result) => {
  showSuccessAlert.value = true;

  try {
    await updatePaymentSuccess(result.order_id);

    setTimeout(() => {
      showSuccessAlert.value = false;
      router.push(`/invitation/create/${result.order_id}`);
    }, 3000);
  } catch (error) {
    console.error(error);
    console.error(error.validationErrors);
  }
};

const handlePaymentPending = async (result) => {
  // router.push(`/invitation/create/checkout/success/${result.order_id}`);
};

const handlePaymentClosed = () => {
  console.log("Pembayaran ditutup tanpa menyelesaikan transaksi");
};
</script>

<template>
  <div class="w-full">
    <!-- Success Alert Modal -->
    <UserInvitationCheckoutPaymentSuccessModal v-if="showSuccessAlert" />

    <button
      @click="handlePayNow"
      class="group w-full relative px-8 py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <span class="relative flex items-center">
        <i class="bi bi-wallet mr-3"></i>
        Bayar Sekarang
      </span>
    </button>
  </div>
</template>
