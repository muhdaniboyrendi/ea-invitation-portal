<script setup>
const { login } = useAuthStore();
const { loginWithGoogleRedirect } = useAuthStore();
const config = useRuntimeConfig();

const mainAppUrl = config.public.mainAppUrl;

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const showPassword = ref(false);
const isLoading = ref(false);
const isLoadingGoogle = ref(false);
const isLoginFailed = ref(false);

// Deteksi tema aplikasi
const colorMode = useColorMode();
const logoSrc = computed(() => {
  return colorMode.value === "dark"
    ? "/logo-text-dark.png"
    : "/logo-text-light.png";
});

const handleLogin = async () => {
  isLoading.value = true;

  try {
    await login(form);
  } catch (error) {
    console.error("Login error:", error);
    form.password = "";
    isLoginFailed.value = true;
    setTimeout(() => {
      isLoginFailed.value = false;
    }, 5000);
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
    isLoginFailed.value = true;
    setTimeout(() => {
      isLoginFailed.value = false;
    }, 5000);
  } finally {
    isLoadingGoogle.value = false;
  }
};
</script>

<template>
  <div id="login" class="relative min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Subtle Background Pattern -->
    <div
      class="absolute inset-0 overflow-hidden opacity-[0.02] dark:opacity-[0.05]"
    >
      <div class="absolute inset-0 bg-grid-pattern"></div>
    </div>

    <!-- Main Login Section -->
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

        <!-- Login Card -->
        <div
          class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <h1
            class="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-8"
          >
            Login
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
              v-if="isLoginFailed"
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
                    Login Gagal
                  </p>
                  <p class="text-xs text-red-600 dark:text-red-300">
                    Email atau password yang Anda masukkan salah
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
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
                  class="w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="nama@email.com"
                  autofocus
                />
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                >
                  <i
                    class="bi bi-envelope text-slate-400 dark:text-slate-500"
                  ></i>
                </div>
              </div>
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
                  autocomplete="current-password"
                  aria-label="Password"
                  class="w-full h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="
                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                  "
                  :aria-pressed="showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-sky-500 transition-colors"
                >
                  <i
                    :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                    class="bi"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 transition-colors"
                  aria-label="Ingat saya"
                />
                <span
                  class="ml-2 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors"
                >
                  Ingat saya
                </span>
              </label>

              <NuxtLink
                to="/forgot-password"
                class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors focus:outline-none focus:underline"
              >
                Lupa password?
              </NuxtLink>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              :aria-busy="isLoading"
              class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
            >
              <span v-if="!isLoading" class="flex items-center gap-2">
                <i class="bi bi-box-arrow-in-right"></i>
                Masuk
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

          <!-- Social Login -->
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
            <Spinner v-else />
            <span>Masuk dengan Google</span>
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Belum punya akun?
            <NuxtLink
              to="/register"
              class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-semibold transition-colors focus:outline-none focus:underline ml-1"
            >
              Daftar sekarang
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Subtle Grid Pattern */
.bg-grid-pattern {
  background-image: linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

@media (prefers-color-scheme: dark) {
  .bg-grid-pattern {
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.03) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  }
}
</style>
