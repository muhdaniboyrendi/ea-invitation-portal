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

    <!-- Invitation Details Form -->
    <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 md:p-8">
      <!-- Header -->
      <header class="mb-8">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg"
          >
            <i class="bi bi-heart-fill text-2xl text-white"></i>
          </div>
          <h2
            class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent mb-3"
          >
            Data Mempelai
          </h2>
          <p
            class="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto"
          >
            Lengkapi nama kedua mempelai untuk undangan pernikahan Anda
          </p>
        </div>
      </header>

      <!-- Form Content -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Groom and Bride Names -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Groom Name -->
          <div class="space-y-2">
            <FormBaseInput
              v-model="invitationData.groom"
              label="Nama Mempelai Pria"
              placeholder="Contoh: Ahmad Rizki"
              :required="true"
              :error="validationErrors.groom"
              @input="handleGroomInput"
            >
              <template #prefix>
                <i class="bi bi-person text-blue-500"></i>
              </template>
            </FormBaseInput>
          </div>

          <!-- Bride Name -->
          <div class="space-y-2">
            <FormBaseInput
              v-model="invitationData.bride"
              label="Nama Mempelai Wanita"
              placeholder="Contoh: Siti Nurhaliza"
              :required="true"
              :error="validationErrors.bride"
              @input="handleBrideInput"
            >
              <template #prefix>
                <i class="bi bi-person-dress text-pink-500"></i>
              </template>
            </FormBaseInput>
          </div>
        </div>

        <!-- Theme ID Validation Error (Hidden) -->
        <div
          v-if="validationErrors.theme_id"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0"
            >
              <i
                class="bi bi-exclamation-triangle text-red-600 dark:text-red-400"
              ></i>
            </div>
            <div>
              <p class="text-red-800 dark:text-red-200 font-medium">
                Tema Belum Dipilih
              </p>
              <p class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ validationErrors.theme_id }}
              </p>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0"
            >
              <i class="bi bi-info-circle text-blue-600 dark:text-blue-400"></i>
            </div>
            <div>
              <p class="text-blue-800 dark:text-blue-200 font-medium">
                Informasi Penting
              </p>
              <p class="text-blue-600 dark:text-blue-400 text-sm mt-1">
                Pastikan nama mempelai sudah benar. Data ini akan ditampilkan di
                undangan Anda dan dapat diubah nanti melalui menu edit undangan.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 md:p-8">
      <!-- Summary Card -->
      <div
        class="bg-gradient-to-br from-white via-white to-purple-50/30 dark:from-dark dark:via-dark dark:to-purple-900/10 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
      >
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
        >
          <i class="bi bi-card-checklist text-purple-500"></i>
          Ringkasan Undangan
        </h3>
        <div class="space-y-3">
          <div
            class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-400 text-sm"
              >Tema Dipilih</span
            >
            <span class="font-medium text-gray-900 dark:text-white">
              {{
                invitationData.theme_id ? "✓ Sudah dipilih" : "✗ Belum dipilih"
              }}
            </span>
          </div>
          <div
            class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-400 text-sm"
              >Mempelai Pria</span
            >
            <span class="font-medium text-gray-900 dark:text-white">
              {{ invitationData.groom || "-" }}
            </span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600 dark:text-gray-400 text-sm"
              >Mempelai Wanita</span
            >
            <span class="font-medium text-gray-900 dark:text-white">
              {{ invitationData.bride || "-" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="button"
          @click="resetForm"
          :disabled="ui.isSubmitting"
          class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
          Reset Form
        </button>
        <button
          type="submit"
          :disabled="ui.isSubmitting || !isFormValid"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          <span v-if="!ui.isSubmitting" class="flex items-center gap-2">
            <i class="bi bi-check-circle-fill"></i>
            Buat Undangan
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <Spinner />
            Membuat Undangan...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
