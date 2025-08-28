<script setup>
const { fetchPackage } = usePackageStore();
const route = useRoute();

const packageId = route.params.id;
const packageDetails = ref(null);
const pending = ref(true);

const adminFee = ref(2500);
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

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  // Navigate to orders page or home
  // navigateTo('/orders')
};
</script>

<template>
  <UserInvitationCheckoutSkeleton v-if="pending" />

  <div
    v-else
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <!-- Main Content -->
    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Left Column - Order Summary -->
      <div class="space-y-6">
        <!-- Order Items -->
        <UserInvitationCheckoutOrderItem
          :package="packageDetails"
          :admin-fee="adminFee"
        />
      </div>

      <!-- Right Column - Payment Form -->
      <div class="space-y-6">
        <!-- Payment Method -->
        <!-- <UserInvitationCheckoutPaymentMethod /> -->

        <!-- Action Buttons -->
        <UserInvitationCheckoutActionButton :package="packageDetails" />
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
