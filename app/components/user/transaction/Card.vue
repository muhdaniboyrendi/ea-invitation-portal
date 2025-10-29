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
        "bg-amber-50/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },
    paid: {
      text: "Dibayar",
      class:
        "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    expired: {
      text: "Kadaluarsa",
      class: "bg-red-50/80 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    },
    canceled: {
      text: "Dibatalkan",
      class:
        "bg-slate-50/80 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300",
    },
  };

  return statusMap[status] || statusMap.pending;
};

const getButtonConfig = (status) => {
  const buttonMap = {
    pending: {
      text: "Bayar Sekarang",
      show: true,
      bg: "from-sky-500 to-sky-600 shadow-sky-500/30 hover:shadow-sky-500/60",
    },
    paid: {
      text: "Isi Undangan",
      show: true,
      bg: "from-emerald-500 to-emerald-600 shadow-emerald-500/30 hover:shadow-emerald-500/60",
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
    router.push(`/invitation/create/${props.order?.order_id}`);
  }
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
        class="relative p-4 md:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/10 dark:border-slate-800/10"
      >
        <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
          <!-- Transaction Info -->
          <div class="flex items-start space-x-4 flex-1">
            <!-- Transaction Icon -->
            <div class="relative flex-shrink-0">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 bg-gradient-to-r from-sky-500 to-sky-600"
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
                    class="text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 truncate"
                  >
                    Paket {{ props.order?.package?.name }}
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {{ props.order?.payment_method }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p
              class="text-lg text-sky-600 dark:text-sky-400 font-bold transition-colors duration-300"
            >
              Rp {{ formatRupiah(props.order?.amount) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">IDR</p>
          </div>
        </div>
        <div class="flex items-center mt-4">
          <div class="flex items-center space-x-4">
            <!-- Date -->
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40 transition-all duration-300"
              >
                <i
                  class="bi bi-calendar3 text-xs text-slate-600 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                ></i>
              </div>
              <span class="text-xs text-slate-600 dark:text-slate-300">
                {{ formatRelativeDate(props.order.created_at) }}
              </span>
            </div>

            <!-- Time -->
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40 transition-all duration-300"
              >
                <i
                  class="bi bi-clock text-xs text-slate-600 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                ></i>
              </div>
              <span class="text-xs text-slate-600 dark:text-slate-300">
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
            class="px-6 py-3 bg-gradient-to-r text-white rounded-2xl font-medium shadow-lg hover:scale-105 transition-all duration-300"
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
