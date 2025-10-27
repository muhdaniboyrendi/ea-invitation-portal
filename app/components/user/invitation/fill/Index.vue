<script setup>
const route = useRoute();
const { fetchInvitation } = useInvitationStore();

const invitationId = route.params.invitationId;

// --- State untuk data undangan ---
const invitationData = ref({});
const isLoading = ref(true);

// --- State untuk Navigasi Form ---
const currentStep = ref(1);

// ✅ NEW: State untuk track apakah step dapat dilanjutkan
const canProceedToNextStep = ref(true);

// ✅ Base step details (semua step yang tersedia)
const baseStepDetails = [
  { id: 1, title: "Informasi Utama Undangan", alwaysShow: true },
  { id: 2, title: "Data Mempelai Pria", alwaysShow: true },
  { id: 3, title: "Data Mempelai Wanita", alwaysShow: true },
  { id: 4, title: "Daftar Acara", alwaysShow: true },
  { id: 5, title: "Kisah Cinta", alwaysShow: true },
  { id: 6, title: "Daftar Hadiah", alwaysShow: true },
  { id: 7, title: "Galeri Foto", alwaysShow: true },
  { id: 8, title: "Video", alwaysShow: false }, // Conditional step
  { id: 9, title: "Selesai", alwaysShow: true }, // Completion step
];

// ✅ Computed: Filter steps berdasarkan package
const stepDetails = computed(() => {
  const packageId = Number(invitationData.value?.order?.package_id);

  // Jika package_id === 1, hapus step Video (id: 8)
  if (packageId === 1) {
    return baseStepDetails.filter((step) => step.id !== 8);
  }

  // Jika package lain, tampilkan semua step
  return baseStepDetails;
});

// ✅ Computed: Total steps dinamis berdasarkan stepDetails yang terfilter
const totalSteps = computed(() => stepDetails.value.length);

// ✅ Computed: Current title berdasarkan step yang aktif
const currentTitle = computed(() => {
  const step = stepDetails.value.find((s) => s.id === currentStep.value);
  return step ? step.title : "";
});

// ✅ Computed: Check apakah step video tersedia
const hasVideoStep = computed(() => {
  const packageId = Number(invitationData.value?.order?.package_id);
  return packageId !== 1;
});

// ✅ NEW: Handler untuk menerima update status dari child component
const handleStepStatusUpdate = (canProceed) => {
  canProceedToNextStep.value = canProceed;
};

// Fungsi untuk navigasi
const nextStep = () => {
  if (currentStep.value < totalSteps.value && canProceedToNextStep.value) {
    // Jika step saat ini adalah step 7 (Gallery) dan package_id === 1
    // Skip langsung ke selesai atau step terakhir
    if (currentStep.value === 7 && !hasVideoStep.value) {
      return;
    }

    currentStep.value++;
    canProceedToNextStep.value = true; // Reset untuk step berikutnya
    window.scrollTo({ top: 0, behavior: "instant" });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    canProceedToNextStep.value = true; // Reset saat kembali
    window.scrollTo({ top: 0, behavior: "instant" });
  }
};

// --- State Notification ---
const notification = reactive({
  show: false,
  type: "info",
  message: "",
});

const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
};

const closeNotification = () => {
  notification.show = false;
};

// Handle success/error dari form
const handleFormSuccess = (message) => {
  showNotification("success", message);
};

const handleFormError = (message) => {
  showNotification("error", message);
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
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <div v-if="isLoading" class="text-center py-8">
      <div
        class="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
      >
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
        ></div>
        <p>Memuat data pernikahan...</p>
      </div>
    </div>

    <div v-else>
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {{ currentTitle }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Langkah {{ currentStep }} dari {{ totalSteps }}
        </p>

        <!-- Progress Bar -->
        <div class="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>

        <div class="flex justify-between items-center pt-6">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="h-10 aspect-square bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow cursor-pointer"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            :disabled="!canProceedToNextStep"
            :class="[
              'h-10 aspect-square font-medium rounded-xl transition-all duration-300 shadow',
              canProceedToNextStep
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50'
            ]"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <div
          v-if="currentStep < totalSteps && !canProceedToNextStep"
          class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <p class="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <i class="bi bi-info-circle"></i>
            <span>Silakan isi dan simpan data terlebih dahulu untuk melanjutkan ke langkah berikutnya</span>
          </p>
        </div>
      </div>

      <div>
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