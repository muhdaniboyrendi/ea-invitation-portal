<script setup>
const { checkInvitation, createInvitation } = useInvitationStore();
const route = useRoute();
const router = useRouter();

const orderId = route.params.orderId;

// Notification state
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

// Step management
const currentStep = ref(1);
const totalSteps = 3;

// Reactive state
const invitationData = reactive({
  order_id: orderId,
  groom: "",
  bride: "",
  theme_id: null,
});

const selectedTheme = ref(null);

const ui = reactive({
  pending: true,
  isSubmitting: false,
});

// Step handlers
const handleCoupleSaved = (coupleNames) => {
  invitationData.bride = coupleNames.bride;
  invitationData.groom = coupleNames.groom;
  currentStep.value = 2;
};

const handleThemeSelected = (theme) => {
  invitationData.theme_id = theme.id;
  selectedTheme.value = theme;
  currentStep.value = 3;
};

const handleBackToCouple = () => {
  currentStep.value = 1;
};

const handleBackToTheme = () => {
  currentStep.value = 2;
};

// Form submission
const submitForm = async () => {
  ui.isSubmitting = true;
  try {
    console.log("Submitting invitation data:", invitationData);
    
    const response = await createInvitation(invitationData);

    showNotification("success", "Undangan berhasil dibuat!");

    setTimeout(() => {
      router.push(`/invitation/fill/${response.id}`);
    }, 1500);
  } catch (error) {
    console.error("Error creating invitation:", error);

    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Gagal membuat undangan. Silakan coba lagi.";
    showNotification("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const loadInvitation = async () => {
  ui.pending = true;

  try {
    const response = await checkInvitation(orderId);
    router.push(`/invitation/fill/${response.id}`);
  } catch (error) {
    console.error(error);
  } finally {
    ui.pending = false;
  }
};

onMounted(() => {
  loadInvitation();
});
</script>

<template>
  <div class="space-y-8">
    <!-- Popup Alert Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <UserInvitationSetupLoadingState v-if="ui.pending" />

    <div v-else class="space-y-8">
      <!-- Progress Indicator -->
      <div class="max-w-3xl mx-auto mb-8">
        <div class="flex items-center justify-between mb-4">
          <div
            v-for="step in totalSteps"
            :key="step"
            class="flex items-center flex-1"
          >
            <div class="flex flex-col items-center flex-1">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                  currentStep >= step
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
                ]"
              >
                <i v-if="currentStep > step" class="bi bi-check-lg text-lg"></i>
                <span v-else>{{ step }}</span>
              </div>
              <span
                :class="[
                  'text-xs mt-2 font-medium',
                  currentStep >= step
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-500 dark:text-slate-400',
                ]"
              >
                {{
                  step === 1 ? "Pasangan" : step === 2 ? "Tema" : "Ringkasan"
                }}
              </span>
            </div>
            <div
              v-if="step < totalSteps"
              :class="[
                'h-1 flex-1 mx-2 transition-all duration-300',
                currentStep > step
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600'
                  : 'bg-slate-200 dark:bg-slate-700',
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step 1: Couple Form -->
      <UserInvitationSetupCoupleForm
        v-if="currentStep === 1"
        :order-id="orderId"
        @next="handleCoupleSaved"
      />

      <!-- Step 2: Theme Selection -->
      <UserInvitationSetupThemeSelection
        v-if="currentStep === 2"
        :order-id="orderId"
        @theme-selected="handleThemeSelected"
        @back="handleBackToCouple"
      />

      <!-- Step 3: Summary -->
      <UserInvitationSetupSummary
        v-if="currentStep === 3"
        :invitation-data="invitationData"
        :theme-data="selectedTheme"
        :is-submitting="ui.isSubmitting"
        @submit="submitForm"
        @back="handleBackToTheme"
      />
    </div>
  </div>
</template>
