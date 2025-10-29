<script setup>
const emit = defineEmits(["next"]);
const coupleNames = ref({
  bride: "",
  groom: "",
});

const errors = ref({
  bride: "",
  groom: "",
});

const isValidating = ref({
  bride: false,
  groom: false,
});

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const validateName = (name, field) => {
  if (!name || name.trim() === "") {
    errors.value[field] = "Nama tidak boleh kosong";
    return false;
  }
  if (name.length < 2) {
    errors.value[field] = "Nama minimal 2 karakter";
    return false;
  }
  if (name.length > 50) {
    errors.value[field] = "Nama maksimal 50 karakter";
    return false;
  }
  errors.value[field] = "";
  return true;
};

// Debounced validation for real-time checking
const debouncedValidate = debounce((field) => {
  isValidating.value[field] = true;
  validateName(coupleNames.value[field], field);
  isValidating.value[field] = false;
}, 500); // 500ms delay

const handleBlur = (field) => {
  validateName(coupleNames.value[field], field);
};

// Check if form is valid
const isFormValid = computed(() => {
  const brideValid =
    coupleNames.value.bride.trim() !== "" &&
    coupleNames.value.bride.length >= 2 &&
    coupleNames.value.bride.length <= 50 &&
    !errors.value.bride;

  const groomValid =
    coupleNames.value.groom.trim() !== "" &&
    coupleNames.value.groom.length >= 2 &&
    coupleNames.value.groom.length <= 50 &&
    !errors.value.groom;

  return brideValid && groomValid;
});

// Watch for real-time validation
watch(
  () => coupleNames.value.bride,
  (newValue) => {
    if (newValue) {
      debouncedValidate("bride");
    } else {
      errors.value.bride = "";
    }
  }
);

watch(
  () => coupleNames.value.groom,
  (newValue) => {
    if (newValue) {
      debouncedValidate("groom");
    } else {
      errors.value.groom = "";
    }
  }
);

const handleNext = () => {
  if (isFormValid.value) {
    emit("next", { ...coupleNames.value });
  }
};
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-6 md:p-8">
    <!-- Header -->
    <div class="text-center space-y-2 mb-6">
      <h1
        class="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 dark:from-sky-400 dark:via-blue-400 dark:to-sky-500 bg-clip-text text-transparent leading-tight"
      >
        Nama Pasangan
      </h1>
      <p
        class="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto px-2"
      >
        Masukkan nama panggilan kedua mempelai yang akan ditampilkan di undangan
        Anda.
      </p>
    </div>

    <!-- Form -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <!-- Groom Name -->
      <FormBaseInput
        v-model="coupleNames.groom"
        label="Nama Mempelai Pria"
        placeholder="Contoh: Ahmad"
        type="text"
        :required="true"
        :error="errors.groom"
        @blur="handleBlur('groom')"
      />

      <!-- Bride Name -->
      <FormBaseInput
        v-model="coupleNames.bride"
        label="Nama Mempelai Wanita"
        placeholder="Contoh: Sarah"
        type="text"
        :required="true"
        :error="errors.bride"
        @blur="handleBlur('bride')"
      />
    </div>

    <button
      @click="handleNext"
      :disabled="!isFormValid"
      class="w-full py-3 px-6 mt-8 rounded-2xl font-semibold transition-all duration-300"
      :class="
        isFormValid
          ? 'bg-sky-500 hover:bg-sky-600 dark:hover:bg-sky-400 text-white cursor-pointer hover:shadow-lg'
          : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60'
      "
    >
      Selanjutnya
    </button>
  </div>
</template>
