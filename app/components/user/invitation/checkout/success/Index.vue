<script setup>
const { fetchOrder } = useOrderStore();
const route = useRoute();
const router = useRouter();

const props = defineProps(["orderId"]);

const orderId = route.params.orderId;

const orderData = ref({});
const pending = ref(false);

const formattedDate = computed(() => {
  if (!orderData.value?.created_at) return "-";
  return new Date(orderData.value.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const handleFetchOrder = async () => {
  pending.value = true;

  try {
    const response = await fetchOrder(orderId);

    orderData.value = response;
  } catch (error) {
    console.error(error);
    console.error(error.validationErrors);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  handleFetchOrder();
});
</script>

<template>
  <div>
    <!-- Main Container -->
    <div class="max-w-4xl mx-auto">
      <!-- Success Hero Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="relative">
            <!-- Animated background circles -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"
            ></div>

            <!-- Icon container -->
            <div
              class="relative w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-4 border-white dark:border-slate-800"
            >
              <i class="bi bi-check-circle text-6xl text-white"></i>
            </div>
          </div>
        </div>

        <h1
          class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-3"
        >
          Pesanan Berhasil!
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Terima kasih telah menggunakan EA Invitation. Segera selesaikan
          transaksi anda dalam waktu kurang dari 24 jam.
        </p>
      </div>

      <!-- Order Details Card -->
      <div
        class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/30 dark:border-slate-800/30 overflow-hidden mb-8"
      >
        <div class="relative p-8">
          <!-- Background gradient accent -->
          <div
            class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-50/20 via-sky-100/20 to-transparent dark:from-sky-950/20 dark:via-sky-900/20 rounded-full blur-3xl"
          ></div>

          <div class="relative space-y-8">
            <!-- Order ID Section -->
            <div
              class="pb-8 border-b border-slate-200/50 dark:border-slate-800/50"
            >
              <p
                class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center"
              >
                <i
                  class="bi bi-receipt text-sky-500 dark:text-sky-400 mr-2"
                ></i>
                NOMOR PESANAN
              </p>
              <p
                class="text-3xl font-bold text-slate-900 dark:text-slate-50 font-mono tracking-wider"
              >
                {{ orderId || "null" }}
              </p>
            </div>

            <!-- Order Info Grid -->
            <div class="grid md:grid-cols-3 gap-6 mt-6">
              <!-- Order Date -->
              <div
                class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-sky-200/30 dark:border-sky-800/30"
              >
                <div class="flex items-center mb-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center mr-3"
                  >
                    <i
                      class="bi bi-calendar-event text-sky-500 dark:text-sky-400"
                    ></i>
                  </div>
                  <span
                    class="text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >Tanggal Pesanan</span
                  >
                </div>
                <p class="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {{ formattedDate }}
                </p>
              </div>

              <!-- Status -->
              <div
                class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-amber-200/30 dark:border-amber-800/30"
              >
                <div class="flex items-center mb-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3"
                  >
                    <i
                      class="bi bi-check-circle text-amber-500 dark:text-amber-400"
                    ></i>
                  </div>
                  <span
                    class="text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >Status</span
                  >
                </div>
                <p class="text-lg font-bold text-amber-600 dark:text-amber-400">
                  Mengunggu Pembayaran
                </p>
              </div>

              <!-- Total Amount -->
              <div
                class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-sky-200/30 dark:border-sky-800/30"
              >
                <div class="flex items-center mb-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center mr-3"
                  >
                    <i class="bi bi-wallet2 text-sky-500 dark:text-sky-400"></i>
                  </div>
                  <span
                    class="text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >Total Pembayaran</span
                  >
                </div>
                <p class="text-lg font-bold text-sky-600 dark:text-sky-400">
                  Rp {{ formatRupiah(orderData.amount) }}
                </p>
              </div>
            </div>

            <!-- Email Notification -->
            <div
              class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-sky-200/30 dark:border-sky-800/30 flex items-start mt-6"
            >
              <div class="flex-shrink-0 mr-4">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-lg bg-sky-500/20"
                >
                  <i
                    class="bi bi-envelope text-sky-500 dark:text-sky-400 text-lg"
                  ></i>
                </div>
              </div>
              <div>
                <h3
                  class="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1"
                >
                  Konfirmasi Dikirim ke Email
                </h3>
                <p class="text-slate-600 dark:text-slate-300 text-sm">
                  Kami telah mengirimkan detail lengkap pesanan Anda ke alamat
                  email terdaftar. Silakan cek email Anda dan folder spam untuk
                  informasi lebih lanjut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- View Order Button -->
        <UserInvitationCheckoutSuccessPayButton
          :snap-token="orderData.snap_token"
        />

        <!-- Continue Shopping Button -->
        <NuxtLink
          to="/"
          class="px-8 py-4 rounded-2xl font-semibold text-lg text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 flex items-center justify-center"
        >
          <i class="bi bi-house mr-3"></i>
          Kembali ke Beranda
        </NuxtLink>
      </div>

      <!-- Support Section -->
      <div class="mt-8 text-center">
        <p class="text-slate-600 dark:text-slate-300 mb-4">
          Ada pertanyaan? Hubungi tim support kami
        </p>
        <div
          class="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:erlanazrdev@gmail.com"
            class="inline-flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold hover:underline"
          >
            <i class="bi bi-envelope mr-2"></i>
            erlanazrdev@gmail.com
          </a>
          <span class="hidden md:inline text-slate-400">•</span>
          <a
            href="https://wa.me/6282220633024"
            target="_blank"
            class="inline-flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold hover:underline"
          >
            <i class="bi bi-whatsapp mr-2"></i>
            Chat WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
