<script setup>
const { checkInvitation, createInvitation } = useInvitationStore();
const route = useRoute();
const router = useRouter();

const orderId = route.params.orderId;

const validationPatterns = {
  theme_id: {
    required: /^.+$/,
    message: {
      required: "Tema wajib dipilih",
    },
  },
};

// Use composables
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
} = useFormValidation(validationPatterns);

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

// Reactive state
const invitationData = reactive({
  order_id: orderId,
  theme_id: null,
});

const ui = reactive({
  pending: true,
  isSubmitting: false,
  isFormTouched: false,
});

// Computed
const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  return !!(
    invitationData.theme_id
  );
});

// Validation functions
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;

  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;

  if (!validateField("theme_id", invitationData.theme_id)) isValid = false;

  return isValid;
};

const handleThemeSelected = (themeId) => {
  ui.isFormTouched = true;
  invitationData.theme_id = themeId;
  clearBackendError("theme_id");
  if (ui.isFormTouched) {
    validateField("theme_id", themeId);
  }
};

// Form submission
const submitForm = async () => {
  ui.isFormTouched = true;

  if (!validateForm()) {
    showNotification("warning", "Mohon lengkapi semua field yang wajib diisi.");
    return;
  }

  ui.isSubmitting = true;
  try {
    const response = await createInvitation(invitationData);

    showNotification("success", "Undangan berhasil dibuat!");

    setTimeout(() => {
      router.push(`/invitation/fill/${response.id}`);
    }, 1500);
  } catch (error) {
    console.error("Error creating invitation:", error);

    if (error?.validationErrors || error?.response?.data?.validationErrors) {
      const backendErrors =
        error.validationErrors || error.response.data.validationErrors;
      setBackendValidationErrors(backendErrors);

      const generalMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Gagal membuat undangan. Periksa form dan coba lagi.";
      showNotification("error", generalMessage);
    } else {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Gagal membuat undangan. Silakan coba lagi.";
      showNotification("error", message);
    }
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
    console.error(error.status);
    console.error(error.validationErrors);
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
      <!-- Theme Selection Section -->
      <UserInvitationSetupThemeSelection
        :order-id="orderId"
        @theme-selected="handleThemeSelected"
      />

      <!-- Summary Card Component -->
      <UserInvitationSetupSummary
        :invitation-data="invitationData"
        :is-submitting="ui.isSubmitting"
        :is-form-valid="isFormValid"
        @submit="submitForm"
      />
    </div>
  </div>
</template>
