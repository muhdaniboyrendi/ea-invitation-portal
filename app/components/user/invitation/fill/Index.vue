<script setup>
import { ref, computed } from "vue";

const route = useRoute();
const { fetchInvitation } = useInvitationStore();

const invitationId = route.params.invitationId;

// --- State untuk Navigasi Form ---
const currentStep = ref(1);
const totalSteps = 3;

const stepDetails = [
  { id: 1, title: "Informasi Utama Undangan" },
  { id: 2, title: "Data Mempelai Pria" },
  { id: 3, title: "Data Mempelai Wanita" },
];

const currentTitle = computed(() => {
  const step = stepDetails.find((s) => s.id === currentStep.value);
  return step ? step.title : "";
});

// Fungsi untuk navigasi
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// --- State yang sudah ada ---
const notification = reactive({
  show: false,
  type: "info",
  message: "",
});

const invitationData = ref({});
const isLoading = ref(true);

const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
};

const closeNotification = () => {
  notification.show = false;
};

// Handle success/error dari form (tidak berubah)
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

        <div class="flex justify-between items-center pt-6">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="h-10 aspect-square bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 hover:scale-105 active:sclae-95 transition-all duration-300 shadow cursor-pointer"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            class="h-10 aspect-square bg-linear-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:scale-105 active:sclae-95 transition-all duration-300 shadow cursor-pointer"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div>
        <UserInvitationFillMainInfo
          v-if="currentStep === 1"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
        />

        <UserInvitationFillGroom
          v-if="currentStep === 2"
          :invitation-id="invitationId"
          :package-id="invitationData.order.package_id"
          @success="handleFormSuccess"
          @error="handleFormError"
          @next="handleNextStep"
        />

        <UserInvitationFillBride
          v-if="currentStep === 3"
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
