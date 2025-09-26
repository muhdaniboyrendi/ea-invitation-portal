<script setup>
import { z } from "zod";

// Props
const props = defineProps({
  packageId: {
    type: String,
    required: false,
    default: null,
  },
});

// Composables
const { createPackage, updatePackage, fetchPackage, refresh } =
  usePackageStore();

// Validation schema
const packageSchema = z.object({
  name: z
    .string()
    .min(1, "Nama paket wajib diisi")
    .min(3, "Nama paket minimal 3 karakter"),
  price: z
    .number()
    .min(1, "Harga harus lebih dari 0")
    .max(1000000000, "Harga terlalu besar"),
  discount: z
    .number()
    .min(0, "Diskon tidak boleh kurang dari 0")
    .max(100, "Diskon tidak boleh lebih dari 100")
    .optional(),
  features: z.array(z.string().min(1)).min(1, "Minimal harus ada 1 fitur"),
});

// Initial form state
const initialFormState = {
  name: "",
  price: "",
  discount: "",
  features: [""],
};

// Reactive state
const formData = reactive({ ...initialFormState });
const validationErrors = ref({});
const ui = reactive({
  isSubmitting: false,
  isLoading: false,
  showSuccess: false,
  showError: false,
  errorMessage: "",
  isFormTouched: false,
});

// Computed
const isEditMode = computed(() => props.packageId !== null);
const isFormValid = computed(() => {
  try {
    const cleanData = getCleanFormData();
    packageSchema.parse(cleanData);
    return Object.keys(validationErrors.value).length === 0;
  } catch {
    return false;
  }
});

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

const showNotification = (type, message, duration = 5000) => {
  if (type === "success") {
    ui.showSuccess = true;
    setTimeout(() => {
      ui.showSuccess = false;
    }, duration);
  } else {
    ui.showError = true;
    ui.errorMessage = message;
    setTimeout(() => {
      ui.showError = false;
      ui.errorMessage = "";
    }, duration);
  }
};

const resetForm = () => {
  Object.assign(formData, { ...initialFormState });
  validationErrors.value = {};
  ui.isFormTouched = false;
  ui.errorMessage = "";
};

// Validation
const validateField = (field, value) => {
  try {
    const testData = { ...getCleanFormData(), [field]: value };
    packageSchema.pick({ [field]: true }).parse({ [field]: testData[field] });
    delete validationErrors.value[field];
  } catch (error) {
    if (error.errors?.length > 0) {
      validationErrors.value[field] = error.errors[0].message;
    }
  }
};

const validateForm = () => {
  try {
    const cleanData = getCleanFormData();
    packageSchema.parse(cleanData);
    validationErrors.value = {};
    return true;
  } catch (error) {
    const errors = {};
    error.errors?.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    validationErrors.value = errors;
    return false;
  }
};

// Feature management
const addFeature = () => {
  formData.features.push("");
};

const removeFeature = (index) => {
  if (formData.features.length > 1) {
    formData.features.splice(index, 1);
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
    const message =
      error?.response?.data?.message ||
      `Gagal ${
        isEditMode.value ? "memperbarui" : "menambahkan"
      } paket. Silakan coba lagi.`;
    showNotification("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const markFormAsTouched = () => {
  ui.isFormTouched = true;
};

// Watchers
watch(
  () => formData.name,
  (newVal) => {
    if (ui.isFormTouched) validateField("name", newVal.trim());
  }
);

watch(
  () => formData.price,
  (newVal) => {
    if (ui.isFormTouched && newVal) validateField("price", Number(newVal));
  }
);

watch(
  () => formData.discount,
  (newVal) => {
    if (ui.isFormTouched)
      validateField("discount", newVal ? Number(newVal) : 0);
  }
);

watch(
  () => formData.features,
  (newVal) => {
    if (ui.isFormTouched)
      validateField(
        "features",
        newVal.filter((f) => f.trim())
      );
  },
  { deep: true }
);

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
    <!-- Header -->
    <header class="mb-6">
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
    </header>

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
      <!-- Success Alert -->
      <Transition name="fade">
        <div
          v-if="ui.showSuccess"
          class="w-full rounded-2xl p-6 bg-green-100 dark:bg-green-950 border border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 font-medium mb-6 flex items-center gap-3"
        >
          <i class="bi bi-check-circle-fill text-lg" />
          <p>
            {{
              isEditMode
                ? "Paket berhasil diperbarui!"
                : "Paket berhasil ditambahkan!"
            }}
          </p>
        </div>
      </Transition>

      <!-- Error Alert -->
      <Transition name="fade">
        <div
          v-if="ui.showError"
          class="w-full rounded-2xl p-6 bg-red-100 dark:bg-red-950 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 font-medium mb-6 flex items-center gap-3"
        >
          <i class="bi bi-exclamation-triangle-fill text-lg" />
          <p>{{ ui.errorMessage }}</p>
        </div>
      </Transition>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Package Name -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nama Paket <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            @input="markFormAsTouched"
            type="text"
            placeholder="Contoh: Basic Wedding"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
            :class="
              validationErrors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
            "
          />
          <Transition name="fade">
            <p
              v-if="validationErrors.name"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle" />
              {{ validationErrors.name }}
            </p>
          </Transition>
        </div>

        <!-- Pricing Section -->
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Price -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Harga <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.price"
              @input="markFormAsTouched"
              type="number"
              min="1"
              placeholder="Masukan harga dalam Rupiah"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
              :class="
                validationErrors.price
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
              "
            />
            <Transition name="fade">
              <p
                v-if="validationErrors.price"
                class="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-circle" />
                {{ validationErrors.price }}
              </p>
            </Transition>
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
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Diskon (%)
            </label>
            <input
              v-model="formData.discount"
              @input="markFormAsTouched"
              type="number"
              min="0"
              max="100"
              placeholder="Masukan diskon jika ada"
              class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
              :class="
                validationErrors.discount
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
              "
            />
            <Transition name="fade">
              <p
                v-if="validationErrors.discount"
                class="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-circle" />
                {{ validationErrors.discount }}
              </p>
            </Transition>
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
              class="flex gap-3 items-center"
            >
              <div class="flex-1">
                <input
                  v-model="formData.features[index]"
                  @input="markFormAsTouched"
                  type="text"
                  :placeholder="`Fitur ${index + 1}`"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <button
                v-if="formData.features.length > 1"
                type="button"
                @click="removeFeature(index)"
                class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
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
