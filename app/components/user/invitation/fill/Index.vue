<script setup>
const route = useRoute();
const { fetchInvitation } = useInvitationStore();

const invitationId = route.params.invitationId;

const invitationData = ref({});
const isLoading = ref(true);

const currentStep = ref(1);

const canProceedToNextStep = ref(true);

const baseStepDetails = [
  { id: 1, title: "Informasi Utama", icon: "bi-heart-fill", alwaysShow: true },
  { id: 2, title: "Mempelai Pria", icon: "bi-person-fill", alwaysShow: true },
  { id: 3, title: "Mempelai Wanita", icon: "bi-person-fill", alwaysShow: true },
  { id: 4, title: "Daftar Acara", icon: "bi-calendar-event", alwaysShow: true },
  { id: 5, title: "Kisah Cinta", icon: "bi-book-heart", alwaysShow: true },
  { id: 6, title: "Daftar Hadiah", icon: "bi-gift", alwaysShow: true },
  { id: 7, title: "Galeri Foto", icon: "bi-images", alwaysShow: true },
  { id: 8, title: "Video", icon: "bi-play-circle", alwaysShow: false },
  { id: 9, title: "Selesai", icon: "bi-check-circle-fill", alwaysShow: true },
];

const stepDetails = computed(() => {
  const packageId = Number(invitationData.value?.order?.package_id);

  // Jika package_id === 1, hapus step Video (id: 8)
  if (packageId === 1) {
    return baseStepDetails.filter((step) => step.id !== 8);
  }

  return baseStepDetails;
});

const totalSteps = computed(() => stepDetails.value.length);

const currentTitle = computed(() => {
  const step = stepDetails.value.find((s) => s.id === currentStep.value);
  return step ? step.title : "";
});

const currentIcon = computed(() => {
  const step = stepDetails.value.find((s) => s.id === currentStep.value);
  return step ? step.icon : "bi-circle";
});

const hasVideoStep = computed(() => {
  const packageId = Number(invitationData.value?.order?.package_id);
  return packageId !== 1;
});

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / totalSteps.value) * 100);
});

const handleStepStatusUpdate = (canProceed) => {
  canProceedToNextStep.value = canProceed;
};

const nextStep = () => {
  if (currentStep.value < totalSteps.value && canProceedToNextStep.value) {
    if (currentStep.value === 7 && !hasVideoStep.value) {
      return;
    }

    currentStep.value++;
    canProceedToNextStep.value = true; // Reset untuk step berikutnya
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    canProceedToNextStep.value = true; // Reset saat kembali
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const notification = reactive({
  show: false,
  type: "info",
  message: "",
  position: "top-right",
});

const showNotification = (type, message, position) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
  notification.position = position;
};

const closeNotification = () => {
  notification.show = false;
};

const handleFormSuccess = (message) => {
  showNotification("success", message, "top-center");
};

const handleFormInfo = (message) => {
  showNotification("info", message, "bottom-right");
};

const handleFormError = (message) => {
  showNotification("error", message, "top-center");
};

const handleNextStep = () => {
  nextStep();
};

const loadInvitationData = async () => {
  isLoading.value = true;
  try {
    const response = await fetchInvitation(invitationId);
    invitationData.value = response;
  } catch (error) {
    handleFormError("Gagal memuat data undangan. Silakan coba lagi.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadInvitationData();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      :position="notification.position"
      :duration="5000"
      @close="closeNotification"
    />

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="min-h-screen flex items-center justify-center px-4 md:px-6"
    >
      <div class="text-center space-y-4">
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-sky-50 dark:bg-sky-950 backdrop-blur-sm"
        >
          <div
            class="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
        <div>
          <p class="text-base font-semibold text-slate-900 dark:text-slate-50">
            Memuat Data
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Sticky Header dengan Progress -->
      <div class="">
        <div class="px-4 md:px-6 py-4 md:py-5">
          <!-- Title & Step Counter -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 md:gap-4 mb-3">
                <div
                  class="h-10 w-10 rounded-xl bg-sky-500 hover:bg-sky-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/25 transition-colors"
                >
                  <i :class="currentIcon" class="bi text-white text-lg"></i>
                </div>
                <h2
                  class="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 truncate"
                >
                  {{ currentTitle }}
                </h2>
              </div>
              <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                Langkah {{ currentStep }} dari {{ totalSteps }}
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div
            class="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
          >
            <div
              class="absolute h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${progressPercentage}%` }"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              ></div>
            </div>
          </div>

          <!-- Warning Message -->
          <div
            v-if="currentStep < totalSteps && !canProceedToNextStep"
            class="mt-4 p-3 md:p-4 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-xl"
          >
            <p
              class="text-xs md:text-sm text-slate-900 dark:text-slate-50 flex items-center gap-2"
            >
              <i class="bi bi-info-circle-fill flex-shrink-0 text-sky-500"></i>
              <span>Simpan data terlebih dahulu untuk melanjutkan</span>
            </p>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between gap-3 px-4 md:px-6 pb-4">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="flex items-center gap-2 px-4 h-11 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-medium rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
          >
            <i class="bi bi-chevron-left text-lg"></i>
            <span class="text-sm">Kembali</span>
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            :disabled="!canProceedToNextStep"
            :class="[
              'flex items-center gap-2 px-4 h-11 font-medium rounded-xl transition-all shadow-sm',
              canProceedToNextStep
                ? 'bg-sky-500 text-white hover:bg-sky-600 active:scale-95 shadow-sky-500/25'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60',
            ]"
          >
            <span class="text-sm">Lanjut</span>
            <i class="bi bi-chevron-right text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <div class="pt-6 px-4 md:px-6 pb-8">
        <!-- Step 1: Informasi Utama -->
        <UserInvitationFillMainInfo
          v-if="currentStep === 1"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
          @step-status="handleStepStatusUpdate"
        />

        <!-- Step 2: Data Mempelai Pria -->
        <UserInvitationFillGroom
          v-if="currentStep === 2"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
          @step-status="handleStepStatusUpdate"
        />

        <!-- Step 3: Data Mempelai Wanita -->
        <UserInvitationFillBride
          v-if="currentStep === 3"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
          @step-status="handleStepStatusUpdate"
        />

        <!-- Step 4: Daftar Acara -->
        <UserInvitationFillEvents
          v-if="currentStep === 4"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
          @step-status="handleStepStatusUpdate"
        />

        <!-- Step 5: Kisah Cinta -->
        <UserInvitationFillLoveStories
          v-if="currentStep === 5"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
        />

        <!-- Step 6: Daftar Hadiah -->
        <UserInvitationFillGifts
          v-if="currentStep === 6"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @info="handleFormInfo"
          @error="handleFormError"
          @next="handleNextStep"
        />

        <!-- Step 7: Galeri Foto -->
        <UserInvitationFillGalleries
          v-if="currentStep === 7"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
        />

        <!-- Step 8: Video (Conditional) -->
        <UserInvitationFillVideos
          v-if="currentStep === 8 && hasVideoStep"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
        />

        <!-- Step 9: Complete -->
        <UserInvitationFillComplete
          v-if="
            (currentStep === 9 && hasVideoStep) ||
            (currentStep === 8 && !hasVideoStep)
          "
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
        />
      </div>
    </div>
  </div>
</template>
