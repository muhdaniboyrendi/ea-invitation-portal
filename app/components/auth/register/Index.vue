<script setup>
const { register } = useAuthStore();
const { loginWithGoogleRedirect } = useAuthStore();
const config = useRuntimeConfig();

const mainAppUrl = config.public.mainAppUrl;

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeToTerms = ref(false);
const isLoading = ref(false);
const isLoadingGoogle = ref(false);
const error = ref(false);
const errorMessage = ref("");

const validationErrors = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
});

const validationState = reactive({
  name: null,
  email: null,
  phone: null,
  password: null,
  password_confirmation: null,
});

// Deteksi tema aplikasi
const colorMode = useColorMode();
const logoSrc = computed(() => {
  return colorMode.value === "dark"
    ? "/logo-text-dark.png"
    : "/logo-text-light.png";
});

const validateName = (value) => {
  if (!value || value.trim().length === 0) {
    return "Nama lengkap tidak boleh kosong";
  }
  if (value.trim().length < 2) {
    return "Nama lengkap minimal 2 karakter";
  }
  if (value.trim().length > 50) {
    return "Nama lengkap maksimal 50 karakter";
  }
  if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
    return "Nama hanya boleh mengandung huruf dan spasi";
  }
  return "";
};

const validateEmail = (value) => {
  if (!value || value.trim().length === 0) {
    return "Email tidak boleh kosong";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Format email tidak valid";
  }
  return "";
};

const validatePhone = (value) => {
  if (!value || value.trim().length === 0) {
    return "Nomor WhatsApp tidak boleh kosong";
  }
  const phoneDigits = value.replace(/\D/g, "");

  if (!/^(08|628|\+628)/.test(value)) {
    return "Nomor harus diawali dengan 08, +628, atau 628";
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return "Nomor WhatsApp harus 10-15 digit";
  }

  return "";
};

const validatePassword = (value) => {
  if (!value || value.length === 0) {
    return "Password tidak boleh kosong";
  }
  if (value.length < 8) {
    return "Password minimal 8 karakter";
  }
  if (!/(?=.*[a-z])/.test(value)) {
    return "Password harus mengandung huruf kecil";
  }
  if (!/(?=.*[A-Z])/.test(value)) {
    return "Password harus mengandung huruf besar";
  }
  if (!/(?=.*\d)/.test(value)) {
    return "Password harus mengandung angka";
  }
  return "";
};

const validatePasswordConfirmation = (value) => {
  if (!value || value.length === 0) {
    return "Konfirmasi password tidak boleh kosong";
  }
  if (value !== form.password) {
    return "Konfirmasi password tidak cocok";
  }
  return "";
};

const validateField = (field, value) => {
  let errorMsg = "";

  switch (field) {
    case "name":
      errorMsg = validateName(value);
      break;
    case "email":
      errorMsg = validateEmail(value);
      break;
    case "phone":
      errorMsg = validatePhone(value);
      break;
    case "password":
      errorMsg = validatePassword(value);
      if (form.password_confirmation) {
        const confirmError = validatePasswordConfirmation(
          form.password_confirmation
        );
        validationErrors.password_confirmation = confirmError;
        validationState.password_confirmation =
          confirmError === "" ? true : false;
      }
      break;
    case "password_confirmation":
      errorMsg = validatePasswordConfirmation(value);
      break;
  }

  validationErrors[field] = errorMsg;
  validationState[field] = errorMsg === "" ? true : false;
};

watch(
  () => form.name,
  (newVal) => {
    if (newVal !== "") validateField("name", newVal);
  }
);

watch(
  () => form.email,
  (newVal) => {
    if (newVal !== "") validateField("email", newVal);
  }
);

watch(
  () => form.phone,
  (newVal) => {
    if (newVal !== "") validateField("phone", newVal);
  }
);

watch(
  () => form.password,
  (newVal) => {
    if (newVal !== "") validateField("password", newVal);
  }
);

watch(
  () => form.password_confirmation,
  (newVal) => {
    if (newVal !== "") validateField("password_confirmation", newVal);
  }
);

const validateAllFields = () => {
  validateField("name", form.name);
  validateField("email", form.email);
  validateField("phone", form.phone);
  validateField("password", form.password);
  validateField("password_confirmation", form.password_confirmation);

  return Object.values(validationErrors).every((error) => error === "");
};

const isFormValid = computed(() => {
  return (
    Object.values(validationState).every((state) => state === true) &&
    agreeToTerms.value
  );
});

const handleRegister = async () => {
  const isValid = validateAllFields();

  if (!isValid) {
    error.value = true;
    errorMessage.value = "Mohon perbaiki kesalahan pada form";
    setTimeout(() => {
      error.value = false;
      errorMessage.value = "";
    }, 5000);
    return;
  }

  if (!agreeToTerms.value) {
    errorMessage.value = "Anda harus menyetujui syarat dan ketentuan!";
    error.value = true;
    setTimeout(() => {
      error.value = false;
      errorMessage.value = "";
    }, 5000);
    return;
  }

  isLoading.value = true;

  try {
    const res = await register(form);
    console.log("Register attempt:", res);
  } catch (error) {
    console.error("Registration error:", error.validationErrors);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleRedirect = async () => {
  try {
    isLoadingGoogle.value = true;
    await loginWithGoogleRedirect();
  } catch (err) {
    console.error("Google Login error:", err);
    error.value = true;
    errorMessage.value = "Google login gagal";
    setTimeout(() => {
      error.value = false;
      errorMessage.value = "";
    }, 5000);
  } finally {
    isLoadingGoogle.value = false;
  }
};

const formatPhoneNumber = (value) => {
  let cleaned = value.replace(/\D/g, "");

  if (cleaned.startsWith("62")) {
    cleaned = "+" + cleaned;
  } else if (cleaned.startsWith("8")) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
};

const handlePhoneInput = (event) => {
  const value = event.target.value;
  form.phone = formatPhoneNumber(value);
};
</script>

<template>
  <div
    id="register"
    class="relative min-h-screen bg-slate-50 dark:bg-slate-950"
  >
    <!-- Subtle Background Pattern -->
    <div
      class="absolute inset-0 overflow-hidden opacity-[0.02] dark:opacity-[0.05]"
    >
      <div class="absolute inset-0 bg-grid-pattern"></div>
    </div>

    <!-- Main Register Section -->
    <section
      class="relative z-10 flex items-center justify-center min-h-screen px-4 py-12"
    >
      <div class="w-full max-w-md">
        <!-- Logo & Brand -->
        <div class="text-center mb-6 md:mb-8">
          <ClientOnly>
            <a :href="mainAppUrl" aria-label="ea invitation">
              <NuxtImg
                :src="logoSrc"
                width="200"
                height="50"
                loading="lazy"
                quality="80"
                class="mb-6 mx-auto"
                alt="Logo"
              />
            </a>
          </ClientOnly>
          <p class="text-xs text-slate-500 dark:text-slate-500">
            Kelola undangan digital Anda
          </p>
        </div>

        <!-- Register Card -->
        <div
          class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <!-- Header -->
          <h1
            class="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-6"
          >
            Buat Akun Baru
          </h1>

          <!-- Error Alert -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="error"
              role="alert"
              aria-live="polite"
              class="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0"
                >
                  <i
                    class="bi bi-exclamation-triangle text-red-500 text-sm"
                  ></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-semibold text-red-900 dark:text-red-100 mb-1"
                  >
                    Registrasi Gagal
                  </p>
                  <p class="text-xs text-red-600 dark:text-red-300">
                    {{ errorMessage }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Register Form -->
          <form @submit.prevent="handleRegister" class="space-y-4">
            <!-- Full Name Input -->
            <div class="space-y-2">
              <label
                for="name"
                class="block text-sm font-medium text-slate-900 dark:text-slate-50"
              >
                Nama Lengkap
              </label>
              <div class="relative">
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  autocomplete="name"
                  aria-label="Nama lengkap"
                  :class="[
                    'w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all',
                    validationState.name === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : validationState.name === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500 focus:border-sky-500',
                  ]"
                  placeholder="Masukkan nama lengkap"
                  @blur="validateField('name', form.name)"
                  autofocus
                />
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center gap-1"
                >
                  <i
                    v-if="validationState.name === true"
                    class="bi bi-check-circle-fill text-green-500 text-sm"
                  ></i>
                  <i
                    v-else-if="validationState.name === false"
                    class="bi bi-exclamation-circle-fill text-red-500 text-sm"
                  ></i>
                  <i
                    v-else
                    class="bi bi-person text-slate-400 dark:text-slate-500"
                  ></i>
                </div>
              </div>
              <p
                v-if="validationErrors.name"
                class="text-xs text-red-500 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-triangle"></i>
                {{ validationErrors.name }}
              </p>
            </div>

            <!-- Email Input -->
            <div class="space-y-2">
              <label
                for="email"
                class="block text-sm font-medium text-slate-900 dark:text-slate-50"
              >
                Email
              </label>
              <div class="relative">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  aria-label="Email address"
                  :class="[
                    'w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all',
                    validationState.email === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : validationState.email === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500 focus:border-sky-500',
                  ]"
                  placeholder="nama@email.com"
                  @blur="validateField('email', form.email)"
                />
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center gap-1"
                >
                  <i
                    v-if="validationState.email === true"
                    class="bi bi-check-circle-fill text-green-500 text-sm"
                  ></i>
                  <i
                    v-else-if="validationState.email === false"
                    class="bi bi-exclamation-circle-fill text-red-500 text-sm"
                  ></i>
                  <i
                    v-else
                    class="bi bi-envelope text-slate-400 dark:text-slate-500"
                  ></i>
                </div>
              </div>
              <p
                v-if="validationErrors.email"
                class="text-xs text-red-500 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-triangle"></i>
                {{ validationErrors.email }}
              </p>
            </div>

            <!-- Phone Input -->
            <div class="space-y-2">
              <label
                for="phone"
                class="block text-sm font-medium text-slate-900 dark:text-slate-50"
              >
                WhatsApp
              </label>
              <div class="relative">
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  autocomplete="tel"
                  aria-label="Nomor WhatsApp"
                  :class="[
                    'w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all',
                    validationState.phone === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : validationState.phone === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500 focus:border-sky-500',
                  ]"
                  placeholder="08** **** ****"
                  @input="handlePhoneInput"
                  @blur="validateField('phone', form.phone)"
                />
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center gap-1"
                >
                  <i
                    v-if="validationState.phone === true"
                    class="bi bi-check-circle-fill text-green-500 text-sm"
                  ></i>
                  <i
                    v-else-if="validationState.phone === false"
                    class="bi bi-exclamation-circle-fill text-red-500 text-sm"
                  ></i>
                  <i
                    v-else
                    class="bi bi-whatsapp text-slate-400 dark:text-slate-500"
                  ></i>
                </div>
              </div>
              <p
                v-if="validationErrors.phone"
                class="text-xs text-red-500 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-triangle"></i>
                {{ validationErrors.phone }}
              </p>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label
                for="password"
                class="block text-sm font-medium text-slate-900 dark:text-slate-50"
              >
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  aria-label="Password"
                  :class="[
                    'w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all',
                    validationState.password === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : validationState.password === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500 focus:border-sky-500',
                  ]"
                  placeholder="Minimal 8 karakter"
                  @blur="validateField('password', form.password)"
                />
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center gap-1"
                >
                  <i
                    v-if="validationState.password === true"
                    class="bi bi-check-circle-fill text-green-500 text-sm"
                  ></i>
                  <i
                    v-else-if="validationState.password === false"
                    class="bi bi-exclamation-circle-fill text-red-500 text-sm"
                  ></i>
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    :aria-label="
                      showPassword
                        ? 'Sembunyikan password'
                        : 'Tampilkan password'
                    "
                    :aria-pressed="showPassword"
                    class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-sky-500 transition-colors"
                  >
                    <i
                      :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                      class="bi"
                    ></i>
                  </button>
                </div>
              </div>
              <p
                v-if="validationErrors.password"
                class="text-xs text-red-500 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-triangle"></i>
                {{ validationErrors.password }}
              </p>

              <!-- Password Strength Indicator -->
              <div v-if="form.password" class="space-y-2">
                <div class="flex gap-1">
                  <div
                    :class="[
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      form.password.length >= 8
                        ? 'bg-yellow-500'
                        : 'bg-slate-200 dark:bg-slate-700',
                    ]"
                  ></div>
                  <div
                    :class="[
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      /(?=.*[a-z])(?=.*[A-Z])/.test(form.password)
                        ? 'bg-lime-500'
                        : 'bg-slate-200 dark:bg-slate-700',
                    ]"
                  ></div>
                  <div
                    :class="[
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      /(?=.*\d)/.test(form.password)
                        ? 'bg-green-500'
                        : 'bg-slate-200 dark:bg-slate-700',
                    ]"
                  ></div>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Harus mengandung: huruf besar, huruf kecil, dan angka
                </p>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="space-y-2">
              <label
                for="password_confirmation"
                class="block text-sm font-medium text-slate-900 dark:text-slate-50"
              >
                Konfirmasi Password
              </label>
              <div class="relative">
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  aria-label="Konfirmasi password"
                  :class="[
                    'w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all',
                    validationState.password_confirmation === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : validationState.password_confirmation === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500 focus:border-sky-500',
                  ]"
                  placeholder="Ulangi password"
                  @blur="
                    validateField(
                      'password_confirmation',
                      form.password_confirmation
                    )
                  "
                />
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center gap-1"
                >
                  <i
                    v-if="validationState.password_confirmation === true"
                    class="bi bi-check-circle-fill text-green-500 text-sm"
                  ></i>
                  <i
                    v-else-if="validationState.password_confirmation === false"
                    class="bi bi-exclamation-circle-fill text-red-500 text-sm"
                  ></i>
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    :aria-label="
                      showConfirmPassword
                        ? 'Sembunyikan password'
                        : 'Tampilkan password'
                    "
                    :aria-pressed="showConfirmPassword"
                    class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-sky-500 transition-colors"
                  >
                    <i
                      :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
                      class="bi"
                    ></i>
                  </button>
                </div>
              </div>
              <p
                v-if="validationErrors.password_confirmation"
                class="text-xs text-red-500 flex items-center gap-1"
              >
                <i class="bi bi-exclamation-triangle"></i>
                {{ validationErrors.password_confirmation }}
              </p>
            </div>

            <!-- Terms & Conditions -->
            <div class="flex items-start gap-3">
              <input
                v-model="agreeToTerms"
                type="checkbox"
                required
                class="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 transition-colors"
                aria-label="Setuju syarat dan ketentuan"
              />
              <label class="text-sm text-slate-600 dark:text-slate-400">
                Saya menyetujui
                <NuxtLink
                  to="/"
                  class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
                >
                  Syarat & Ketentuan
                </NuxtLink>
                dan
                <NuxtLink
                  to="/"
                  class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
                >
                  Kebijakan Privasi
                </NuxtLink>
              </label>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              :aria-busy="isLoading"
              :class="[
                'w-full h-12 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900',
                isFormValid && !isLoading
                  ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed',
              ]"
            >
              <span v-if="!isLoading" class="flex items-center gap-2">
                <i class="bi bi-person-check"></i>
                Daftar Sekarang
              </span>
              <span v-else class="flex items-center gap-2">
                <div
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  role="status"
                  aria-label="Loading"
                ></div>
                Memproses...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div
                class="w-full border-t border-slate-200 dark:border-slate-800"
              ></div>
            </div>
            <div class="relative flex justify-center">
              <span
                class="px-3 py-1 bg-white dark:bg-slate-900 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                atau
              </span>
            </div>
          </div>

          <!-- Social Register -->
          <button
            @click="handleGoogleRedirect"
            :disabled="isLoading || isLoadingGoogle"
            :aria-busy="isLoadingGoogle"
            type="button"
            class="w-full h-12 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 font-medium rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
          >
            <svg
              v-if="!isLoadingGoogle"
              class="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <div
              v-else
              class="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-slate-50 rounded-full animate-spin"
              role="status"
              aria-label="Loading"
            ></div>
            <span>Daftar dengan Google</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Sudah punya akun?
            <NuxtLink
              to="/login"
              class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-semibold transition-colors focus:outline-none focus:underline ml-1"
            >
              Masuk
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
