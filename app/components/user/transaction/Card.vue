<script setup>
const { updatePaymentSuccess } = usePaymentStore();
const { $midtrans } = useNuxtApp();
const router = useRouter();

const props = defineProps(["order"]);

const showSuccessAlert = ref(false);

const getStatusConfig = (status) => {
  const statusMap = {
    pending: {
      text: "Menunggu pembayaran",
      class:
        "bg-amber-100/80 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    paid: {
      text: "Dibayar",
      class:
        "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    },
    expired: {
      text: "Kadaluarsa",
      class: "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    },
    canceled: {
      text: "Dibatalkan",
      class:
        "bg-gray-100/80 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
    },
  };

  return statusMap[status] || statusMap.pending;
};

const getButtonConfig = (status) => {
  const buttonMap = {
    pending: {
      text: "Bayar Sekarang",
      show: true,
      bg: "from-blue-500 to-purple-500 shadow-blue-500/30 hover:shadow-blue-500/60",
    },
    paid: {
      text: "Isi Undangan",
      show: true,
      bg: "from-green-500 to-teal-500 shadow-green-500/30 hover:shadow-green-500/60",
    },
    expired: {
      text: "",
      show: false,
    },
    canceled: {
      text: "",
      show: false,
    },
  };

  return buttonMap[status] || buttonMap.pending;
};

const handleButtonAction = () => {
  if (props.order?.payment_status == "pending") {
    $midtrans.openSnapPayment(props.order?.snap_token, {
      onSuccess: (result) => handlePaymentSuccess(result),
      onPending: (result) => handlePaymentPending(result),
      onClose: () => handlePaymentClosed(),
    });
  } else {
    router.push("/");
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

const handlePaymentPending = (result) => {
  router.push(`/invitation/create/checkout/success/${result.order_id}`);
};

const handlePaymentClosed = () => {
  console.log("Pembayaran ditutup tanpa menyelesaikan transaksi");
};
</script>

<template>
  <div>
    <!-- Success Alert Modal -->
    <UserInvitationCheckoutPaymentSuccessModal v-if="showSuccessAlert" />

    <div
      class="relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
    >
      <!-- Card Content -->
      <div
        class="relative p-4 md:p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10"
      >
        <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
          <!-- Transaction Info -->
          <div class="flex items-start space-x-4 flex-1">
            <!-- Transaction Icon -->
            <div class="relative flex-shrink-0">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 bg-linear-to-r from-blue-500 to-purple-500"
              >
                <i
                  class="bi bi-box text-white text-xl transition-transform duration-300 group-hover:rotate-12"
                ></i>
              </div>
            </div>

            <!-- Transaction Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3
                    class="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate"
                  >
                    Paket {{ props.order?.package?.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ props.order?.payment_method }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p
              class="text-lg text-blue-600 dark:text-blue-400 font-bold transition-colors duration-300"
            >
              Rp {{ formatRupiah(props.order?.amount) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">IDR</p>
          </div>
        </div>
        <div class="flex items-center mt-4">
          <div class="flex items-center space-x-4">
            <!-- Date -->
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-300"
              >
                <i
                  class="bi bi-calendar3 text-xs text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                ></i>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">
                {{ formatRelativeDate(props.order.created_at) }}
              </span>
            </div>

            <!-- Time -->
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-300"
              >
                <i
                  class="bi bi-clock text-xs text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                ></i>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">
                {{ formatTimeToIndonesian(props.order.created_at) }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-end mt-4">
          <!-- Status Badge -->
          <div
            class="px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all duration-300"
            :class="getStatusConfig(props.order?.payment_status).class"
          >
            {{ getStatusConfig(props.order?.payment_status).text }}
          </div>
          <button
            v-if="getButtonConfig(props.order?.payment_status).show"
            @click="handleButtonAction"
            type="button"
            class="px-6 py-3 bg-linear-to-r text-white rounded-2xl font-medium shadow-lg hover:scale-105 transition-all duration-300"
            :class="getButtonConfig(props.order?.payment_status).bg"
          >
            {{ getButtonConfig(props.order?.payment_status).text }}
            <i class="bi bi-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
