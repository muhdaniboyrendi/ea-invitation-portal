<script setup>
const { createPackage, refresh } = usePackageStore();

const formData = reactive({
  name: "",
  price: "",
  discount: "",
  features: [""],
});

const errors = ref({});
const isSubmitting = ref(false);
const isSuccess = ref(false);
const isError = ref(false);
const errorMessage = ref("");
const isFormTouched = ref(false); // Flag untuk mengetahui apakah form sudah pernah diinteraksi

const addFeature = () => {
  formData.features.push("");
};

const removeFeature = (index) => {
  if (formData.features.length > 1) {
    formData.features.splice(index, 1);
  }
};

const validateName = () => {
  // Jangan validasi jika form belum pernah disentuh
  if (!isFormTouched.value) return true;

  if (!formData.name.trim()) {
    errors.value.name = "Nama paket wajib diisi";
    return false;
  } else if (formData.name.trim().length < 3) {
    errors.value.name = "Nama paket minimal 3 karakter";
    return false;
  } else {
    delete errors.value.name;
    return true;
  }
};

const validatePrice = () => {
  // Jangan validasi jika form belum pernah disentuh
  if (!isFormTouched.value) return true;

  if (!formData.price || formData.price === "") {
    errors.value.price = "Harga wajib diisi";
    return false;
  } else if (formData.price <= 0) {
    errors.value.price = "Harga harus lebih dari 0";
    return false;
  } else if (formData.price > 1000000000) {
    errors.value.price = "Harga terlalu besar";
    return false;
  } else {
    delete errors.value.price;
    return true;
  }
};

const validateDiscount = () => {
  if (
    formData.discount !== "" &&
    (formData.discount < 0 || formData.discount > 100)
  ) {
    errors.value.discount = "Diskon harus antara 0-100%";
    return false;
  } else {
    delete errors.value.discount;
    return true;
  }
};

const validateFeatures = () => {
  // Jangan validasi jika form belum pernah disentuh
  if (!isFormTouched.value) return true;

  const validFeatures = formData.features.filter((f) => f.trim());
  if (validFeatures.length === 0) {
    errors.value.features = "Minimal harus ada 1 fitur";
    return false;
  } else {
    delete errors.value.features;
    return true;
  }
};

// Watchers for real-time validation
watch(() => formData.name, validateName);
watch(() => formData.price, validatePrice);
watch(() => formData.discount, validateDiscount);
watch(() => formData.features, validateFeatures, { deep: true });

// Complete form validation untuk submit
const validateForm = () => {
  const nameValid = formData.name.trim() && formData.name.trim().length >= 3;
  const priceValid =
    formData.price && formData.price > 0 && formData.price <= 1000000000;
  const discountValid =
    formData.discount === "" ||
    (formData.discount >= 0 && formData.discount <= 100);
  const featuresValid = formData.features.filter((f) => f.trim()).length > 0;

  return nameValid && priceValid && discountValid && featuresValid;
};

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return (
    Object.keys(errors.value).length === 0 &&
    formData.name.trim() &&
    formData.price &&
    formData.features.some((f) => f.trim())
  );
});

const submitForm = async () => {
  // Set form sebagai sudah disentuh untuk mengaktifkan validasi
  isFormTouched.value = true;

  // Panggil validasi sekali lagi sebelum submit
  validateName();
  validatePrice();
  validateDiscount();
  validateFeatures();

  if (!validateForm()) return;

  isSubmitting.value = true;
  // Reset alerts sebelum submit
  isSuccess.value = false;
  isError.value = false;

  try {
    const cleanFeatures = formData.features.filter((f) => f.trim());

    const packageData = {
      name: formData.name.trim(),
      price: parseInt(formData.price),
      discount: formData.discount ? parseInt(formData.discount) : 0,
      features: cleanFeatures,
    };

    await createPackage(packageData);

    isSuccess.value = true;
    resetForm();
    refresh();

    setTimeout(() => {
      isSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error("Error creating package:", error);
    isError.value = true;
    errorMessage.value =
      error?.response?.data?.message ||
      "Gagal menambahkan paket. Silakan coba lagi.";

    setTimeout(() => {
      isError.value = false;
      errorMessage.value = "";
    }, 5000);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  // Reset flag form touched agar validasi tidak langsung muncul
  isFormTouched.value = false;

  Object.assign(formData, {
    name: "",
    price: "",
    discount: "",
    features: [""],
  });
  errors.value = {};
  errorMessage.value = "";
};

// Function untuk menandai form sudah disentuh saat user mulai mengetik
const markFormAsTouched = () => {
  if (!isFormTouched.value) {
    isFormTouched.value = true;
  }
};

// Calculate discounted price
const discountedPrice = computed(() => {
  if (!formData.price || !formData.discount) return null;
  const price = parseInt(formData.price);
  const discount = parseInt(formData.discount);
  return price - (price * discount) / 100;
});
</script>

<template>
  <!-- Form Section -->
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
    <h2
      class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3"
    >
      <div
        class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
      >
        <i class="bi bi-plus-lg text-blue-600 dark:text-blue-400"></i>
      </div>
      Detail Paket
    </h2>

    <!-- Success Alert -->
    <Transition name="fade">
      <div
        v-if="isSuccess"
        class="w-full rounded-2xl p-6 bg-green-100 dark:bg-green-950 border border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 font-medium mb-6 flex items-center gap-3"
      >
        <i class="bi bi-check-circle-fill text-lg"></i>
        <p>Paket berhasil ditambahkan!</p>
      </div>
    </Transition>

    <!-- Error Alert -->
    <Transition name="fade">
      <div
        v-if="isError"
        class="w-full rounded-2xl p-6 bg-red-100 dark:bg-red-950 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 font-medium mb-6 flex items-center gap-3"
      >
        <i class="bi bi-exclamation-triangle-fill text-lg"></i>
        <p>{{ errorMessage }}</p>
      </div>
    </Transition>

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
            errors.name
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
          "
        />
        <Transition name="fade">
          <p
            v-if="errors.name"
            class="text-red-500 text-sm mt-1 flex items-center gap-1"
          >
            <i class="bi bi-exclamation-circle"></i>
            {{ errors.name }}
          </p>
        </Transition>
      </div>

      <!-- Pricing Section -->
      <div class="grid md:grid-cols-2 gap-4">
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
              errors.price
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
            "
          />
          <Transition name="fade">
            <p
              v-if="errors.price"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle"></i>
              {{ errors.price }}
            </p>
          </Transition>
          <Transition name="fade">
            <p
              v-if="formData.price && !errors.price"
              class="text-green-600 dark:text-green-400 text-sm mt-1"
            >
              Rp {{ formatRupiah(formData.price) }}
            </p>
          </Transition>
        </div>
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
              errors.discount
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
            "
          />
          <Transition name="fade">
            <p
              v-if="errors.discount"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <i class="bi bi-exclamation-circle"></i>
              {{ errors.discount }}
            </p>
          </Transition>
          <Transition name="fade">
            <p
              v-if="discountedPrice && !errors.discount && !errors.price"
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
            <i class="bi bi-plus text-sm"></i>
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
              <i class="bi bi-trash text-sm"></i>
            </button>
          </div>
        </div>
        <Transition name="fade">
          <p
            v-if="errors.features"
            class="text-red-500 text-sm mt-2 flex items-center gap-1"
          >
            <i class="bi bi-exclamation-circle"></i>
            {{ errors.features }}
          </p>
        </Transition>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-6">
        <button
          type="button"
          @click="resetForm"
          :disabled="isSubmitting"
          class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-800 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="!isSubmitting">Simpan Paket</span>
          <span v-else class="flex items-center justify-center gap-2">
            <Spinner />
            Menyimpan...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
