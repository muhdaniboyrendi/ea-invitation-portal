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

// Step configuration
const steps = [
  {
    number: 1,
    label: "Pasangan",
    icon: "bi-heart-fill",
    shortLabel: "Pasangan",
  },
  {
    number: 2,
    label: "Tema",
    icon: "bi-palette-fill",
    shortLabel: "Tema",
  },
  {
    number: 3,
    label: "Ringkasan",
    icon: "bi-check-circle-fill",
    shortLabel: "Review",
  },
];

// Reactive state
const invitationData = reactive({
  order_id: orderId,
  groom_name: "",
  bride_name: "",
  theme_id: null,
});

const selectedTheme = ref(null);

const ui = reactive({
  pending: true,
  isSubmitting: false,
});

// Step handlers
const handleCoupleSaved = (coupleNames) => {
  invitationData.bride_name = coupleNames.bride_name;
  invitationData.groom_name = coupleNames.groom_name;
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
  <div class="space-y-6 md:space-y-8">
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

    <div v-else class="px-4 md:px-6">
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
      />

      <!-- Step 3: Summary -->
      <UserInvitationSetupSummary
        v-if="currentStep === 3"
        :invitation-data="invitationData"
        :theme-data="selectedTheme"
        :is-submitting="ui.isSubmitting"
        @submit="submitForm"
        @reset="handleBackToCouple"
      />
    </div>
  </div>
</template>
