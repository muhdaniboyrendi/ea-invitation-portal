<script setup>
const { completeInvitation, userInvitationsRefresh } = useInvitationStore();
const config = useRuntimeConfig();
const mainAppUrl = config.public.mainAppUrl;

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
      class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div class="flex flex-col items-center justify-center py-8 md:py-12">
        <!-- Animated Spinner -->
        <div class="relative mb-6">
          <div
            class="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 border-t-sky-500 rounded-full animate-spin"
          ></div>
          <div
            class="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-sky-400 rounded-full animate-spin opacity-50"
            style="animation-duration: 1.5s; animation-direction: reverse"
          ></div>
        </div>

        <!-- Loading Text -->
        <h3
          class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3"
        >
          Menyelesaikan Undangan...
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md">
          Mohon tunggu sebentar, kami sedang memproses data undangan Anda
        </p>

        <!-- Loading Steps -->
        <div class="space-y-3 w-full max-w-md">
          <div
            class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700"
          >
            <div
              class="w-8 h-8 bg-sky-50 dark:bg-sky-950 rounded-xl flex items-center justify-center animate-pulse flex-shrink-0"
            >
              <i class="bi bi-check-lg text-sky-500 text-sm"></i>
            </div>
            <span class="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              Memvalidasi data undangan...
            </span>
          </div>

          <div
            class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700"
          >
            <div
              class="w-8 h-8 bg-sky-50 dark:bg-sky-950 rounded-xl flex items-center justify-center animate-pulse flex-shrink-0"
              style="animation-delay: 0.2s"
            >
              <i class="bi bi-gear text-sky-500 text-sm"></i>
            </div>
            <span class="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              Menyiapkan tampilan undangan...
            </span>
          </div>

          <div
            class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700"
          >
            <div
              class="w-8 h-8 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center animate-pulse flex-shrink-0"
              style="animation-delay: 0.4s"
            >
              <i class="bi bi-cloud-check text-emerald-500 text-sm"></i>
            </div>
            <span class="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              Menyimpan konfigurasi...
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="!isLoading && showErrorAlert && !invitationData"
      class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 text-center border border-red-200 dark:border-red-800 shadow-sm"
    >
      <!-- Error Icon -->
      <div class="mb-6 flex justify-center">
        <div
          class="relative w-24 h-24 bg-red-50 dark:bg-red-950 rounded-2xl flex items-center justify-center"
        >
          <i class="bi bi-exclamation-triangle text-red-500 text-5xl"></i>
        </div>
      </div>

      <!-- Error Message -->
      <h2
        class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3"
      >
        Oops! Terjadi Kesalahan
      </h2>
      <p class="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-2">
        Gagal Menyelesaikan Undangan
      </p>
      <p
        class="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
      >
        {{ errorMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          @click="retryCompletion"
          class="w-full sm:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/25 transition-all active:scale-95"
        >
          <span class="flex items-center justify-center gap-2">
            <i class="bi bi-arrow-clockwise"></i>
            Coba Lagi
          </span>
        </button>

        <NuxtLink
          :to="`/invitation/${props.invitationId}`"
          class="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          <span class="flex items-center justify-center gap-2">
            <i class="bi bi-arrow-left"></i>
            Kembali ke Dashboard
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Success Card -->
    <div v-else-if="!isLoading && invitationData" class="text-center">
      <!-- Success Icon -->
      <div class="mb-6 flex justify-center">
        <div
          class="relative w-24 h-24 bg-emerald-50 dark:bg-emerald-950 rounded-4xl flex items-center justify-center"
        >
          <i class="bi bi-check2-circle text-emerald-500 text-5xl"></i>
        </div>
      </div>

      <!-- Success Message -->
      <h2
        class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3"
      >
        Selamat!
      </h2>
      <p class="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-2">
        Undangan Anda Telah Selesai!
      </p>
      <p
        class="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
      >
        Anda telah berhasil melengkapi semua informasi undangan pernikahan Anda.
        Undangan Anda siap untuk dibagikan kepada tamu-tamu undangan!
      </p>

      <!-- Package Info Badge -->
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-950 rounded-full border border-sky-200 dark:border-sky-800 mb-8"
      >
        <i class="bi bi-box-seam text-sky-500"></i>
        <span class="text-sm font-medium text-slate-900 dark:text-slate-50">
          Paket
          {{ invitationData.order?.package?.name }}
        </span>
      </div>

      <!-- Feature Checklist -->
      <div class="grid sm:grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto">
        <div
          class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-check-lg text-emerald-500 text-lg"></i>
          </div>
          <span class="text-sm text-slate-600 dark:text-slate-300 text-left">
            Informasi Mempelai Lengkap
          </span>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-check-lg text-emerald-500 text-lg"></i>
          </div>
          <span class="text-sm text-slate-600 dark:text-slate-300 text-left">
            Jadwal Acara Terkonfigurasi
          </span>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-check-lg text-emerald-500 text-lg"></i>
          </div>
          <span class="text-sm text-slate-600 dark:text-slate-300 text-left">
            Kisah Cinta Ditambahkan
          </span>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-check-lg text-emerald-500 text-lg"></i>
          </div>
          <span class="text-sm text-slate-600 dark:text-slate-300 text-left">
            Galeri & Media Siap
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-200 dark:border-slate-800 my-8"></div>

      <!-- Next Steps Section -->
      <div class="mb-8">
        <h3
          class="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3"
        >
          Langkah Selanjutnya
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Pilih tindakan yang ingin Anda lakukan selanjutnya
        </p>

        <!-- Action Cards -->
        <div class="grid sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
          <!-- Preview Card -->
          <a
            :href="`${mainAppUrl}/${invitationData.slug}`"
            target="_blank"
            class="group bbg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition duration-300 active:scale-95"
          >
            <span
              class="w-14 h-14 bg-sky-50 dark:bg-sky-950 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <i class="bi bi-eye text-sky-500 text-2xl"></i>
            </span>
            <h4
              class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2"
            >
              Preview Undangan
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Lihat tampilan undangan Anda
            </p>
          </a>

          <!-- Manage Invitation Card -->
          <NuxtLink
            :to="`/invitation/${props.invitationId}`"
            class="group bbg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition duration-300 active:scale-95"
          >
            <div
              class="w-14 h-14 bg-sky-50 dark:bg-sky-950 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <i class="bi bi-file-earmark-text text-sky-500 text-2xl"></i>
            </div>
            <h4
              class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2"
            >
              Kelola Undangan
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Edit dan sesuaikan undangan
            </p>
          </NuxtLink>

          <!-- Manage Guests Card -->
          <NuxtLink
            :to="`/invitation/${props.invitationId}/guests`"
            class="group bbg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition duration-300 active:scale-95"
          >
            <div
              class="w-14 h-14 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <i class="bi bi-people text-emerald-500 text-2xl"></i>
            </div>
            <h4
              class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2"
            >
              Kelola Tamu
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Tambah & atur daftar tamu
            </p>
          </NuxtLink>
        </div>
      </div>

      <!-- Primary CTA -->
      <div class="space-y-4">
        <NuxtLink
          :to="`/invitation/${props.invitationId}`"
          class="inline-block w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/25 transition-all active:scale-95"
        >
          <span class="flex items-center justify-center gap-2">
            <i class="bi bi-arrow-right-circle"></i>
            Lanjutkan ke Dashboard
          </span>
        </NuxtLink>

        <p class="text-xs text-slate-500 dark:text-slate-400">
          Anda dapat mengedit data undangan kapan saja dari dashboard
        </p>
      </div>

      <!-- Help Text -->
      <div
        class="mt-8 p-4 bg-sky-50 dark:bg-sky-950 rounded-2xl border border-sky-200 dark:border-sky-800"
      >
        <div class="flex items-start gap-3 text-left">
          <i
            class="bi bi-info-circle text-sky-500 text-xl flex-shrink-0 mt-0.5"
          ></i>
          <div>
            <p
              class="text-sm text-slate-900 dark:text-slate-50 font-medium mb-1"
            >
              Tips: Bagikan Undangan Anda
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-300">
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
