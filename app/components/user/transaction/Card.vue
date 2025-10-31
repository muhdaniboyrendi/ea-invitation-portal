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
        "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
    },
    paid: {
      text: "Dibayar",
      class:
        "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
    },
    expired: {
      text: "Kadaluarsa",
      class:
        "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
    },
    canceled: {
      text: "Dibatalkan",
      class:
        "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800",
    },
  };

  return statusMap[status] || statusMap.pending;
};

const getButtonConfig = (status) => {
  const buttonMap = {
    pending: {
      text: "Bayar Sekarang",
      show: true,
      class: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/25",
    },
    paid: {
      text: "Isi Undangan",
      show: true,
      class: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25",
    },
    expired: {
      text: "",
      show: false,
      class: "",
    },
    canceled: {
      text: "",
      show: false,
      class: "",
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
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
    >
      <!-- Header Section -->
      <div class="flex items-start justify-between gap-4">
        <!-- Left: Icon & Info -->
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <!-- Package Icon -->
          <div
            class="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-box text-white text-xl"></i>
          </div>

          <!-- Package Details -->
          <div class="flex-1 min-w-0">
            <h3
              class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50 truncate mb-1"
            >
              Paket {{ props.order?.package?.name }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              {{ props.order?.payment_method }}
            </p>
          </div>
        </div>

        <!-- Right: Price -->
        <div class="text-right flex-shrink-0">
          <p class="text-lg md:text-xl font-bold text-sky-500">
            Rp {{ formatRupiah(props.order?.amount) }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">IDR</p>
        </div>
      </div>

      <!-- Meta Information -->
      <div class="flex items-center gap-4 flex-wrap">
        <!-- Date -->
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
          >
            <i
              class="bi bi-calendar3 text-xs text-slate-600 dark:text-slate-400"
            ></i>
          </div>
          <span class="text-xs text-slate-600 dark:text-slate-300">
            {{ formatRelativeDate(props.order.created_at) }}
          </span>
        </div>

        <!-- Time -->
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
          >
            <i
              class="bi bi-clock text-xs text-slate-600 dark:text-slate-400"
            ></i>
          </div>
          <span class="text-xs text-slate-600 dark:text-slate-300">
            {{ formatTimeToIndonesian(props.order.created_at) }}
          </span>
        </div>
      </div>

      <!-- Footer: Status & Action -->
      <div class="flex items-end justify-between gap-3 pt-2">
        <!-- Status Badge -->
        <div
          class="px-3 py-1.5 rounded-xl text-xs font-semibold"
          :class="getStatusConfig(props.order?.payment_status).class"
        >
          {{ getStatusConfig(props.order?.payment_status).text }}
        </div>

        <!-- Action Button -->
        <button
          v-if="getButtonConfig(props.order?.payment_status).show"
          @click="handleButtonAction"
          type="button"
          class="px-6 py-3 text-white rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
          :class="getButtonConfig(props.order?.payment_status).class"
        >
          <span>{{ getButtonConfig(props.order?.payment_status).text }}</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>
