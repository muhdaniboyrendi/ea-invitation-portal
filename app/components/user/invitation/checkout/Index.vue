<script setup>
const { fetchPackage } = usePackageStore();
const route = useRoute();

const packageId = route.params.id;
const packageDetails = ref(null);
const pending = ref(true);

const adminFee = ref(2500);
const isProcessing = ref(false);
const showSuccessModal = ref(false);

const loadPackage = async () => {
  pending.value = true;
  try {
    const response = await fetchPackage(packageId);

    packageDetails.value = response;
  } catch (error) {
    console.error("Error loading package:", error);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadPackage();
});

const selectedPayment = ref("credit-card");
const promoCode = ref("");

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

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  // Navigate to orders page or home
  // navigateTo('/orders')
};
</script>

<template>
  <div
    class="relative bg-white dark:bg-dark rounded-3xl p-4 sm:pt-8 md:p-8 md:pt-12 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div v-if="pending">Loading...</div>
    <!-- Main Content -->
    <div v-else class="grid lg:grid-cols-2 gap-8">
      <!-- Left Column - Order Summary -->
      <div class="space-y-6">
        <!-- Order Items -->
        <div
          class="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
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
                    class="bi bi-box text-2xl text-blue-600 dark:text-blue-400"
                  ></i>
                </div>

                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800 dark:text-gray-200">
                    Paket {{ packageDetails.name }}
                  </h3>
                  <div class="flex items-center mt-2 space-x-4">
                    <span class="font-bold text-blue-600 dark:text-blue-400"
                      >Rp {{ formatRupiah(packageDetails.price) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div
              class="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3"
            >
              <div
                class="flex justify-between text-gray-600 dark:text-gray-400"
              >
                <span>Subtotal</span>
                <span>Rp {{ formatRupiah(packageDetails.price) }}</span>
              </div>
              <div
                class="flex justify-between text-gray-600 dark:text-gray-400"
              >
                <span>Biaya Admin</span>
                <span>Rp {{ formatRupiah(adminFee) }}</span>
              </div>
              <div
                class="h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent"
              ></div>
              <div
                class="flex justify-between text-xl font-bold text-gray-800 dark:text-gray-200"
              >
                <span>Total</span>
                <span class="text-blue-600 dark:text-blue-400"
                  >Rp {{ formatRupiah(packageDetails.price + adminFee) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Payment Form -->
      <div class="space-y-6">
        <!-- Payment Method -->
        <!-- <div
          class="backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >

          <div class="relative p-6">
            <h2
              class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center"
            >
              <i
                class="bi bi-credit-card text-blue-600 dark:text-blue-400 mr-3"
              ></i>
              Metode Pembayaran
            </h2>

            <div class="space-y-3">
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                @click="selectedPayment = method.id"
                class="flex items-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer"
                :class="
                  selectedPayment === method.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-300 dark:border-blue-600'
                    : 'bg-white/40 dark:bg-gray-800/40 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/60 dark:hover:bg-gray-700/60'
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
        </div> -->

        <!-- Action Buttons -->
        <div class="space-y-4">
          <!-- Promo Code -->
          <div
            class="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
          >
            <div class="relative p-4">
              <div class="flex space-x-3">
                <input
                  v-model="promoCode"
                  type="text"
                  class="flex-1 px-4 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
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
            class="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-103"
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
              <!-- <span>Bayar Sekarang - Rp {{ formatRupiah(cart.total) }}</span> -->
            </div>

            <!-- Hover Effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 backdrop-blur-xl bg-black/50"></div>

        <div
          class="relative backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-8 max-w-md w-full text-center"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20 rounded-3xl"
          ></div>

          <div class="relative">
            <div
              class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25"
            >
              <i class="bi bi-check text-4xl text-white"></i>
            </div>

            <h3
              class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4"
            >
              Pesanan Berhasil!
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Terima kasih atas pesanan Anda. Kami akan segera memproses dan
              mengirimkan detail pesanan ke email Anda.
            </p>

            <button
              @click="closeSuccessModal"
              class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
