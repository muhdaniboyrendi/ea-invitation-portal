<script setup>
const props = defineProps({
  packageId: {
    type: String,
    required: false,
    default: null,
  },
});

const { createPackage, updatePackage, fetchPackage, refresh } =
  usePackageStore();

const validationPatterns = {
  name: {
    required: /^.+$/,
    minLength: /^.{3,}$/,
    message: {
      required: "Nama paket wajib diisi",
      minLength: "Nama paket minimal 3 karakter",
    },
  },
  price: {
    number: /^\d+(\.\d+)?$/,
    min: /^[1-9]\d*(\.\d+)?$/,
    max: /^(?:[1-9]\d{0,8}|1000000000)(\.\d+)?$/,
    message: {
      required: "Harga wajib diisi",
      number: "Harga harus berupa angka",
      min: "Harga harus lebih dari 0",
      max: "Harga terlalu besar",
    },
  },
  discount: {
    number: /^\d+(\.\d+)?$/,
    range: /^(100(\.0+)?|\d{1,2}(\.\d+)?)$/,
    message: {
      number: "Diskon harus berupa angka",
      range: "Diskon harus antara 0-100",
    },
  },
  features: {
    minArray: /^.+$/,
    message: {
      required: "Minimal harus ada 1 fitur",
      empty: "Fitur tidak boleh kosong",
    },
  },
};

// Initial form state
const initialFormState = {
  name: "",
  price: "",
  discount: "",
  features: [""],
};

// Reactive state
const formData = reactive({ ...initialFormState });
const frontendErrors = ref({});
const backendErrors = ref({});
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  isFormTouched: false,
});

// Alert notification state
const notification = reactive({
  show: false,
  type: "info",
  message: "",
});

// Computed
const isEditMode = computed(() => props.packageId !== null);
const isFormValid = computed(() => {
  const hasErrors = Object.keys(validationErrors.value).length > 0;
  if (hasErrors) return false;

  const cleanData = getCleanFormData();
  const hasValidFeatures =
    cleanData.features.length > 0 && cleanData.features.every((f) => f.trim());

  return !!(cleanData.name && cleanData.price && hasValidFeatures);
});

const validationErrors = computed(() => ({
  ...frontendErrors.value,
  ...backendErrors.value,
}));

const discountedPrice = computed(() => {
  if (!formData.price || !formData.discount) return null;
  const price = Number(formData.price);
  const discount = Number(formData.discount);
  return price - (price * discount) / 100;
});

// Utility functions
const getCleanFormData = () => ({
  name: formData.name.trim(),
  price: Number(formData.price),
  discount: formData.discount ? Number(formData.discount) : 0,
  features: formData.features.filter((f) => f.trim()),
});

const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
};

const closeNotification = () => {
  notification.show = false;
};

const resetForm = () => {
  Object.assign(formData, { ...initialFormState });
  frontendErrors.value = {};
  backendErrors.value = {};
  ui.isFormTouched = false;
};

const clearBackendError = (field) => {
  if (backendErrors.value[field]) {
    delete backendErrors.value[field];
  }
};

const setBackendValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") return;

  backendErrors.value = {};

  Object.keys(errors).forEach((field) => {
    if (errors[field]) {
      if (Array.isArray(errors[field])) {
        backendErrors.value[field] = errors[field][0];
      } else {
        backendErrors.value[field] = errors[field];
      }
    }
  });
};

// Validation functions
const validateField = (field, value) => {
  if (frontendErrors.value[field]) {
    delete frontendErrors.value[field];
  }

  switch (field) {
    case "name":
      return validateName(value);
    case "price":
      return validatePrice(value);
    case "discount":
      return validateDiscount(value);
    case "features":
      return validateFeatures(value);
    default:
      return true;
  }
};

const validateName = (value) => {
  const trimmedValue = value ? value.trim() : "";

  if (!validationPatterns.name.required.test(trimmedValue)) {
    frontendErrors.value.name = validationPatterns.name.message.required;
    return false;
  }

  if (!validationPatterns.name.minLength.test(trimmedValue)) {
    frontendErrors.value.name = validationPatterns.name.message.minLength;
    return false;
  }

  return true;
};

const validatePrice = (value) => {
  const stringValue = value ? value.toString().trim() : "";

  if (!stringValue) {
    frontendErrors.value.price = validationPatterns.price.message.required;
    return false;
  }

  if (!validationPatterns.price.number.test(stringValue)) {
    frontendErrors.value.price = validationPatterns.price.message.number;
    return false;
  }

  const numValue = Number(stringValue);

  if (numValue <= 0) {
    frontendErrors.value.price = validationPatterns.price.message.min;
    return false;
  }

  if (numValue > 1000000000) {
    frontendErrors.value.price = validationPatterns.price.message.max;
    return false;
  }

  return true;
};

const validateDiscount = (value) => {
  const stringValue = value ? value.toString().trim() : "";

  if (!stringValue) return true;

  if (!validationPatterns.discount.number.test(stringValue)) {
    frontendErrors.value.discount = validationPatterns.discount.message.number;
    return false;
  }

  const numValue = Number(stringValue);

  if (numValue < 0 || numValue > 100) {
    frontendErrors.value.discount = validationPatterns.discount.message.range;
    return false;
  }

  return true;
};

const validateFeatures = (featuresArray) => {
  if (!Array.isArray(featuresArray)) {
    frontendErrors.value.features =
      validationPatterns.features.message.required;
    return false;
  }

  const validFeatures = featuresArray.filter((f) => f && f.trim());

  if (validFeatures.length === 0) {
    frontendErrors.value.features =
      validationPatterns.features.message.required;
    return false;
  }

  return true;
};

const validateForm = () => {
  const cleanData = getCleanFormData();
  let isValid = true;

  if (!validateName(cleanData.name)) isValid = false;
  if (!validatePrice(cleanData.price)) isValid = false;
  if (!validateDiscount(formData.discount)) isValid = false;
  if (!validateFeatures(formData.features)) isValid = false;

  return isValid;
};

// Feature management
const addFeature = () => {
  formData.features.push("");
};

const removeFeature = (index) => {
  if (formData.features.length > 1) {
    formData.features.splice(index, 1);
    if (ui.isFormTouched) {
      validateField("features", formData.features);
    }
  }
};

// Data fetching
const fetchPackageData = async () => {
  if (!props.packageId) return;

  ui.isLoading = true;
  try {
    const packageData = await fetchPackage(props.packageId);
    Object.assign(formData, {
      name: packageData.name || "",
      price: packageData.price?.toString() || "",
      discount: packageData.discount?.toString() || "",
      features: packageData.features?.length > 0 ? packageData.features : [""],
    });
  } catch (error) {
    console.error("Error fetching package:", error);
    showNotification("error", "Gagal memuat data paket. Silakan coba lagi.");
  } finally {
    ui.isLoading = false;
  }
};

// Form submission
const submitForm = async () => {
  ui.isFormTouched = true;

  if (!validateForm()) return;

  ui.isSubmitting = true;
  try {
    const packageData = getCleanFormData();

    if (isEditMode.value) {
      await updatePackage(props.packageId, packageData);
      showNotification("success", "Paket berhasil diperbarui!");
    } else {
      await createPackage(packageData);
      showNotification("success", "Paket berhasil ditambahkan!");
      resetForm();
    }

    refresh();
  } catch (error) {
    console.error(
      `Error ${isEditMode.value ? "updating" : "creating"} package:`,
      error
    );

    if (error?.validationErrors || error?.response?.data?.validationErrors) {
      const backendErrors =
        error.validationErrors || error.response.data.validationErrors;
      setBackendValidationErrors(backendErrors);

      const generalMessage =
        error?.message ||
        error?.response?.data?.message ||
        `Gagal ${
          isEditMode.value ? "memperbarui" : "menambahkan"
        } paket. Periksa form dan coba lagi.`;
      showNotification("error", generalMessage);
    } else {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        `Gagal ${
          isEditMode.value ? "memperbarui" : "menambahkan"
        } paket. Silakan coba lagi.`;
      showNotification("error", message);
    }
  } finally {
    ui.isSubmitting = false;
  }
};

// Input handlers with real-time validation
const handleNameInput = () => {
  ui.isFormTouched = true;
  clearBackendError("name");
  clearTimeout(window.nameValidationTimeout);
  window.nameValidationTimeout = setTimeout(() => {
    validateField("name", formData.name);
  }, 300);
};

const handlePriceInput = () => {
  ui.isFormTouched = true;
  clearBackendError("price");
  clearTimeout(window.priceValidationTimeout);
  window.priceValidationTimeout = setTimeout(() => {
    validateField("price", formData.price);
  }, 300);
};

const handleDiscountInput = () => {
  ui.isFormTouched = true;
  clearBackendError("discount");
  clearTimeout(window.discountValidationTimeout);
  window.discountValidationTimeout = setTimeout(() => {
    validateField("discount", formData.discount);
  }, 300);
};

const handleFeatureInput = (index) => {
  ui.isFormTouched = true;
  clearBackendError("features");
  clearTimeout(window.featuresValidationTimeout);
  window.featuresValidationTimeout = setTimeout(() => {
    validateField("features", formData.features);
  }, 300);
};

// Watchers
watch(
  () => props.packageId,
  (newId) => {
    if (newId) {
      fetchPackageData();
    } else {
      resetForm();
    }
  }
);

// Lifecycle
onMounted(() => {
  if (isEditMode.value) {
    fetchPackageData();
  }
});
</script>

<template>
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
    <!-- Alert Notification -->
    <FormAlertNotification
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <!-- Header -->
    <div class="mb-6">
      <h2
        class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3"
      >
        <div
          class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
        >
          <i
            :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-lg'"
            class="text-blue-600 dark:text-blue-400"
          />
        </div>
        {{ isEditMode ? "Edit Paket" : "Detail Paket" }}
      </h2>
    </div>

    <!-- Loading State -->
    <div v-if="ui.isLoading" class="text-center py-8">
      <div
        class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
      >
        <Spinner />
        <p>Memuat data paket...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else>
      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Package Name -->
        <FormBaseInput
          v-model="formData.name"
          label="Nama Paket"
          placeholder="Contoh: Basic Wedding"
          required
          :error="validationErrors.name"
          :disabled="ui.isSubmitting"
          @input="handleNameInput"
        />

        <!-- Pricing Section -->
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Price -->
          <div>
            <FormBaseInput
              v-model="formData.price"
              type="number"
              label="Harga"
              placeholder="Masukan harga dalam Rupiah"
              required
              :error="validationErrors.price"
              :disabled="ui.isSubmitting"
              @input="handlePriceInput"
            />
            <Transition name="fade">
              <p
                v-if="formData.price && !validationErrors.price"
                class="text-green-600 dark:text-green-400 text-sm mt-1"
              >
                Rp {{ formatRupiah(formData.price) }}
              </p>
            </Transition>
          </div>

          <!-- Discount -->
          <div>
            <FormBaseInput
              v-model="formData.discount"
              type="number"
              label="Diskon (%)"
              placeholder="Masukan diskon jika ada"
              :error="validationErrors.discount"
              :disabled="ui.isSubmitting"
              @input="handleDiscountInput"
            />
            <Transition name="fade">
              <p
                v-if="
                  discountedPrice &&
                  !validationErrors.discount &&
                  !validationErrors.price
                "
                class="text-green-600 dark:text-green-400 text-sm mt-1"
              >
                Harga setelah diskon: Rp {{ formatRupiah(discountedPrice) }}
              </p>
            </Transition>
          </div>
        </div>

        <!-- Features Section -->
        <div>
          <div class="flex items-end justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fitur Paket <span class="text-red-500">*</span>
            </label>
            <button
              type="button"
              @click="addFeature"
              class="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <i class="bi bi-plus text-sm" />
              <span class="text-sm">Tambah</span>
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(feature, index) in formData.features"
              :key="index"
              class="flex gap-3 items-start"
            >
              <div class="flex-1">
                <input
                  v-model="formData.features[index]"
                  @input="handleFeatureInput(index)"
                  type="text"
                  :placeholder="`Fitur ${index + 1}`"
                  :disabled="ui.isSubmitting"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                v-if="formData.features.length > 1"
                type="button"
                @click="removeFeature(index)"
                :disabled="ui.isSubmitting"
                class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="bi bi-trash text-sm" />
              </button>
            </div>
          </div>
          <Transition name="fade">
            <p
              v-if="validationErrors.features"
              class="text-red-500 text-sm mt-2 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle" />
              {{ validationErrors.features }}
            </p>
          </Transition>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-6">
          <button
            type="button"
            @click="resetForm"
            :disabled="ui.isSubmitting"
            class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              {{ isEditMode ? "Perbarui Paket" : "Simpan Paket" }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
