<script setup>
const { fetchOrder } = useOrderStore();
const { createInvitation } = useInvitationStore();
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
  groom: {
    required: /^.+$/,
    minLength: /^.{2,}$/,
    message: {
      required: "Nama mempelai pria wajib diisi",
      minLength: "Nama mempelai pria minimal 2 karakter",
    },
  },
  bride: {
    required: /^.+$/,
    minLength: /^.{2,}$/,
    message: {
      required: "Nama mempelai wanita wajib diisi",
      minLength: "Nama mempelai wanita minimal 2 karakter",
    },
  },
};

// Use composables
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
  resetErrors,
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

// Initial form state
const initialFormState = {
  order_id: orderId,
  theme_id: null,
  groom: "",
  bride: "",
};

// Reactive state
const invitationData = reactive({ ...initialFormState });
const ui = reactive({
  isSubmitting: false,
  isLoadingOrder: false,
  isFormTouched: false,
});

const orderData = ref({});

// Computed
const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;

  if (hasErrors) return false;

  return !!(
    invitationData.theme_id &&
    invitationData.groom.trim() &&
    invitationData.bride.trim()
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
  if (!validateField("groom", invitationData.groom)) isValid = false;
  if (!validateField("bride", invitationData.bride)) isValid = false;

  return isValid;
};

// Form handlers
const resetForm = () => {
  Object.assign(invitationData, { ...initialFormState });
  resetErrors();
  ui.isFormTouched = false;
};

// Enhanced input handlers
const handleGroomInput = () => {
  ui.isFormTouched = true;
  clearBackendError("groom");
  clearTimeout(window.groomValidationTimeout);
  window.groomValidationTimeout = setTimeout(() => {
    validateField("groom", invitationData.groom);
  }, 300);
};

const handleBrideInput = () => {
  ui.isFormTouched = true;
  clearBackendError("bride");
  clearTimeout(window.brideValidationTimeout);
  window.brideValidationTimeout = setTimeout(() => {
    validateField("bride", invitationData.bride);
  }, 300);
};

const handleThemeSelected = (themeId) => {
  ui.isFormTouched = true;
  invitationData.theme_id = themeId;
  clearBackendError("theme_id");
  if (ui.isFormTouched) {
    validateField("theme_id", themeId);
  }
};

// Data fetching
const loadOrderData = async () => {
  ui.isLoadingOrder = true;

  try {
    const response = await fetchOrder(orderId);
    orderData.value = response;
  } catch (error) {
    console.error(error);
    showNotification("error", "Gagal memuat data pesanan. Silakan coba lagi.");
  } finally {
    ui.isLoadingOrder = false;
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
    await createInvitation(invitationData);
    showNotification("success", "Undangan berhasil dibuat!");

    // Redirect after success
    setTimeout(() => {
      router.push(`/user/invitations`);
    }, 1500);
  } catch (error) {
    console.error("Error creating invitation:", error);
    console.error("Error creating invitation:", validationErrors);

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

// Lifecycle
onMounted(() => {
  loadOrderData();
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

    <!-- Theme Selection Section -->
    <UserInvitationSetupThemeSelection
      :order-id="orderId"
      @theme-selected="handleThemeSelected"
    />

    <!-- Invitation Details Form Component -->
    <UserInvitationSetupCoupleForm
      v-model="invitationData"
      :validation-errors="validationErrors"
      @groom-input="handleGroomInput"
      @bride-input="handleBrideInput"
    />

    <!-- Summary Card Component -->
    <UserInvitationSetupSummary
      :invitation-data="invitationData"
      :is-submitting="ui.isSubmitting"
      :is-form-valid="isFormValid"
      @submit="submitForm"
      @reset="resetForm"
    />
  </div>
</template>
