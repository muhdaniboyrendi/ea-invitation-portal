<script setup>
const { completeInvitation, userInvitationsRefresh } = useInvitationStore();

const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const isLoading = ref(true);
const invitationData = ref(null);
const showErrorAlert = ref(false);
const errorMessage = ref("");

const previewInvitation = () => {
  const previewUrl = `/preview/${props.invitationId}`;
  window.open(previewUrl, "_blank");
};

const completingInvitation = async () => {
  isLoading.value = true;
  showErrorAlert.value = false;

  try {
    const response = await completeInvitation(props.invitationId);
    invitationData.value = response;
    userInvitationsRefresh();
  } catch (error) {
    console.error(error);

    // Handle error message
    if (error.validationErrors) {
      const errors = Object.values(error.validationErrors).flat();
      errorMessage.value =
        errors.join(", ") || "Terjadi kesalahan validasi data";
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value =
        "Terjadi kesalahan saat memproses undangan. Silakan coba lagi.";
    }

    showErrorAlert.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleCloseAlert = () => {
  showErrorAlert.value = false;
};

const retryCompletion = () => {
  completingInvitation();
};

onMounted(() => {
  completingInvitation();
});
</script>

<template>
  <div class="relative">
    <!-- Error Alert Notification -->
    <FormAlertNotification
      type="error"
      :message="errorMessage"
      :show="showErrorAlert"
      position="top-center"
      :duration="8000"
      @close="handleCloseAlert"
    />

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 text-center border-2 border-blue-200 dark:border-blue-800 shadow-xl"
    >
      <div class="flex flex-col items-center justify-center py-12">
        <!-- Animated Spinner -->
        <div class="relative mb-6">
          <div
            class="h-24 w-24 border-8 border-blue-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"
          ></div>
          <div
            class="absolute inset-0 h-24 w-24 border-8 border-transparent border-t-purple-500 rounded-full animate-spin"
            style="animation-duration: 1.5s; animation-direction: reverse"
          ></div>
        </div>

        <!-- Loading Text -->
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Menyelesaikan Undangan...
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Mohon tunggu sebentar, kami sedang memproses data undangan Anda
        </p>

        <!-- Loading Steps -->
        <div class="space-y-3 w-full max-w-md">
          <div
            class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
          >
            <div
              class="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse"
            >
              <i class="bi bi-check-lg text-blue-500 text-sm"></i>
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Memvalidasi data undangan...
            </span>
          </div>

          <div
            class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
          >
            <div
              class="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center animate-pulse"
              style="animation-delay: 0.2s"
            >
              <i class="bi bi-gear text-purple-500 text-sm"></i>
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Menyiapkan tampilan undangan...
            </span>
          </div>

          <div
            class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
          >
            <div
              class="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse"
              style="animation-delay: 0.4s"
            >
              <i class="bi bi-cloud-check text-green-500 text-sm"></i>
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Menyimpan konfigurasi...
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="!isLoading && showErrorAlert && !invitationData"
      class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 text-center border-2 border-red-200 dark:border-red-800 shadow-xl"
    >
      <!-- Error Icon -->
      <div class="mb-6 flex justify-center">
        <div
          class="relative h-32 w-32 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-2xl"
        >
          <i class="bi bi-exclamation-triangle text-white text-7xl"></i>
        </div>
      </div>

      <!-- Error Message -->
      <h2
        class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Oops! Terjadi Kesalahan
      </h2>
      <p class="text-xl text-gray-700 dark:text-gray-300 mb-2">
        Gagal Menyelesaikan Undangan
      </p>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        {{ errorMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          @click="retryCompletion"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span class="flex items-center gap-2">
            <i class="bi bi-arrow-clockwise"></i>
            Coba Lagi
          </span>
        </button>

        <NuxtLink
          :to="`/invitation/${props.invitationId}`"
          class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          <span class="flex items-center gap-2">
            <i class="bi bi-arrow-left"></i>
            Kembali ke Dashboard
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Success Card -->
    <div
      v-else-if="!isLoading && invitationData"
      class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 text-center border-2 border-green-200 dark:border-green-800 shadow-xl"
    >
      <!-- Success Icon -->
      <div class="mb-6 flex justify-center">
        <div
          class="relative h-32 w-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow"
        >
          <i class="bi bi-check2-circle text-white text-7xl"></i>
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"
          ></div>
        </div>
      </div>

      <!-- Success Message -->
      <h2
        class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
      >
        🎉 Selamat! 🎉
      </h2>
      <p class="text-xl text-gray-700 dark:text-gray-300 mb-2">
        Undangan Anda Telah Selesai!
      </p>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Anda telah berhasil melengkapi semua informasi undangan pernikahan Anda.
        Undangan Anda siap untuk dibagikan kepada tamu-tamu undangan!
      </p>

      <!-- Package Info Badge -->
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md mb-8"
      >
        <i class="bi bi-box-seam text-blue-500"></i>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Paket
          {{
            packageId === 1
              ? "Basic"
              : packageId === 2
              ? "Premium"
              : packageId === 3
              ? "Platinum"
              : "Ultimate"
          }}
        </span>
      </div>

      <!-- Feature Checklist -->
      <div class="grid md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex items-center gap-3"
        >
          <div
            class="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <i
              class="bi bi-check-lg text-green-600 dark:text-green-400 text-xl"
            ></i>
          </div>
          <span class="text-sm text-gray-700 dark:text-gray-300 text-left">
            Informasi Mempelai Lengkap
          </span>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex items-center gap-3"
        >
          <div
            class="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <i
              class="bi bi-check-lg text-green-600 dark:text-green-400 text-xl"
            ></i>
          </div>
          <span class="text-sm text-gray-700 dark:text-gray-300 text-left">
            Jadwal Acara Terkonfigurasi
          </span>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex items-center gap-3"
        >
          <div
            class="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <i
              class="bi bi-check-lg text-green-600 dark:text-green-400 text-xl"
            ></i>
          </div>
          <span class="text-sm text-gray-700 dark:text-gray-300 text-left">
            Kisah Cinta Ditambahkan
          </span>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex items-center gap-3"
        >
          <div
            class="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <i
              class="bi bi-check-lg text-green-600 dark:text-green-400 text-xl"
            ></i>
          </div>
          <span class="text-sm text-gray-700 dark:text-gray-300 text-left">
            Galeri & Media Siap
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 dark:border-gray-700 my-8"></div>

      <!-- Next Steps Section -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Langkah Selanjutnya
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Pilih tindakan yang ingin Anda lakukan selanjutnya
        </p>

        <!-- Action Cards -->
        <div class="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <!-- Preview Card -->
          <button
            @click="previewInvitation"
            class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div
              class="h-16 w-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <i class="bi bi-eye text-white text-3xl"></i>
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
              Preview Undangan
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Lihat tampilan undangan Anda
            </p>
          </button>

          <!-- Manage Invitation Card -->
          <NuxtLink
            :to="`/invitation/${props.invitationId}`"
            class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div
              class="h-16 w-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <i class="bi bi-file-earmark-text text-white text-3xl"></i>
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
              Kelola Undangan
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Edit dan sesuaikan undangan
            </p>
          </NuxtLink>

          <!-- Manage Guests Card -->
          <NuxtLink
            :to="`/invitation/${props.invitationId}/guests`"
            class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-300 dark:hover:border-green-700"
          >
            <div
              class="h-16 w-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <i class="bi bi-people text-white text-3xl"></i>
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
              Kelola Tamu
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tambah & atur daftar tamu
            </p>
          </NuxtLink>
        </div>
      </div>

      <!-- Primary CTA -->
      <div class="space-y-4">
        <NuxtLink
          to="/invitation"
          class="inline-block w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span class="flex items-center justify-center gap-2">
            <i class="bi bi-arrow-right-circle"></i>
            Lanjutkan ke Dashboard
          </span>
        </NuxtLink>

        <p class="text-xs text-gray-500 dark:text-gray-400">
          Anda dapat mengedit data undangan kapan saja dari dashboard
        </p>
      </div>

      <!-- Help Text -->
      <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div class="flex items-start gap-3">
          <i
            class="bi bi-info-circle text-blue-500 text-xl flex-shrink-0 mt-0.5"
          ></i>
          <div class="text-left">
            <p
              class="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1"
            >
              Tips: Bagikan Undangan Anda
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Jangan lupa untuk menambahkan daftar tamu dan membagikan link
              undangan kepada mereka. Anda juga dapat melihat statistik RSVP
              dari dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
