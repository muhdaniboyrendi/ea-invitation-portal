<script setup>
const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const props = defineProps(["orderId"]);

const orderId = route.params.id;
const orderData = computed(() => orderStore.currentOrder);

const formattedDate = computed(() => {
  if (!orderData.value?.createdAt) return "-";
  return new Date(orderData.value.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const handleNavigate = (path) => {
  router.push(path);
};
</script>

<template>
  <div
    class="min-h-screen bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8"
  >
    <!-- Main Container -->
    <div class="max-w-4xl mx-auto">
      <!-- Success Hero Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="relative">
            <!-- Animated background circles -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"
            ></div>

            <!-- Icon container -->
            <div
              class="relative w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 border-4 border-white dark:border-gray-800"
            >
              <i class="bi bi-check-circle text-6xl text-white"></i>
            </div>
          </div>
        </div>

        <h1
          class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Pesanan Berhasil!
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Terima kasih atas pesanan Anda. Kami telah menerima permintaan Anda
          dan akan segera memproses pesanan tersebut.
        </p>
      </div>

      <!-- Order Details Card -->
      <div
        class="bg-white dark:bg-dark rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden mb-8"
      >
        <div class="relative p-8">
          <!-- Background gradient accent -->
          <div
            class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 via-purple-100/20 to-transparent dark:from-blue-950/20 dark:via-purple-950/20 rounded-full blur-3xl"
          ></div>

          <div class="relative space-y-8">
            <!-- Order ID Section -->
            <div
              class="pb-8 border-b border-gray-200/50 dark:border-gray-700/50"
            >
              <p
                class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center"
              >
                <i
                  class="bi bi-receipt text-blue-600 dark:text-blue-400 mr-2"
                ></i>
                NOMOR PESANAN
              </p>
              <p
                class="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-wider"
              >
                {{ orderId || "#ORD-2024-001" }}
              </p>
            </div>

            <!-- Order Info Grid -->
            <div class="grid md:grid-cols-3 gap-6 mt-6">
              <!-- Order Date -->
              <div
                class="bg-off-white dark:bg-gray-900 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30"
              >
                <div class="flex items-center mb-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3"
                  >
                    <i
                      class="bi bi-calendar-event text-blue-600 dark:text-blue-400"
                    ></i>
                  </div>
                  <span
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                    >Tanggal Pesanan</span
                  >
                </div>
                <p class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formattedDate }}
                </p>
              </div>

              <!-- Status -->
              <div
                class="bg-off-white dark:bg-gray-900 rounded-2xl p-6 border border-green-200/30 dark:border-green-800/30"
              >
                <div class="flex items-center mb-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-3"
                  >
                    <i
                      class="bi bi-check-circle text-green-600 dark:text-green-400"
                    ></i>
                  </div>
                  <span
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                    >Status</span
                  >
                </div>
                <p class="text-lg font-bold text-green-600 dark:text-green-400">
                  Terkonfirmasi
                </p>
              </div>

              <!-- Total Amount -->
              <div
                class="bg-off-white dark:bg-gray-900 rounded-2xl p-6 border border-purple-200/30 dark:border-purple-800/30"
              >
                <div class="flex items-center mb-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3"
                  >
                    <i
                      class="bi bi-wallet2 text-purple-600 dark:text-purple-400"
                    ></i>
                  </div>
                  <span
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                    >Total Pembayaran</span
                  >
                </div>
                <p
                  class="text-lg font-bold text-purple-600 dark:text-purple-400"
                >
                  Rp
                  {{
                    orderData?.finalPrice
                      ? formatRupiah(orderData.finalPrice)
                      : "0"
                  }}
                </p>
              </div>
            </div>

            <!-- Email Notification -->
            <div
              class="bg-off-white dark:bg-gray-900 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30 flex items-start mt-6"
            >
              <div class="flex-shrink-0 mr-4">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/20"
                >
                  <i
                    class="bi bi-envelope text-blue-600 dark:text-blue-400 text-lg"
                  ></i>
                </div>
              </div>
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                >
                  Konfirmasi Dikirim ke Email
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
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
        <button
          @click="handleNavigate('/orders')"
          class="group relative px-8 py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <span class="relative flex items-center">
            <i class="bi bi-wallet mr-3"></i>
            Bayar Sekarang
          </span>
        </button>

        <!-- Continue Shopping Button -->
        <NuxtLink
          to="/"
          class="px-8 py-4 rounded-2xl font-semibold text-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center"
        >
          <i class="bi bi-house mr-3"></i>
          Kembali ke Beranda
        </NuxtLink>
      </div>

      <!-- Support Section -->
      <div class="mt-8 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Ada pertanyaan? Hubungi tim support kami
        </p>
        <div
          class="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:erlanazrdev@gmail.com"
            class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline"
          >
            <i class="bi bi-envelope mr-2"></i>
            erlanazrdev@gmail.com
          </a>
          <span class="hidden md:inline text-gray-400">•</span>
          <a
            href="https://wa.me/6282220633024"
            target="_blank"
            class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline"
          >
            <i class="bi bi-whatsapp mr-2"></i>
            Chat WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
