<script setup>
const { user } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
const colorMode = useColorMode();

const isMenuOpen = ref(false);
const isThemeMenuOpen = ref(false);
const isLoading = ref(false);
const showLogoutModal = ref(false);

const currentTheme = ref("light");

const themeOptions = [
  {
    value: "light",
    icon: "bi bi-sun",
  },
  {
    value: "dark",
    icon: "bi bi-moon",
  },
  {
    value: "system",
    icon: "bi bi-display",
  },
];

const setTheme = (theme) => {
  colorMode.preference = theme;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isThemeMenuOpen.value = false;
  }
};

const navigateToProfile = () => {
  navigateTo("/profile");
  isMenuOpen.value = false;
};

// Handle logout button click - show confirmation modal
const handleLogoutClick = () => {
  showLogoutModal.value = true;
};

// Handle logout confirmation
const handleConfirmLogout = async () => {
  isLoading.value = true;

  try {
    await logout();
  } catch (error) {
    console.error("Logout failed:", error);
    console.error("Logout failed:", error.validationErrors);
  } finally {
    showLogoutModal.value = false;
    isMenuOpen.value = false;
    isLoading.value = false;
  }
};

// Handle logout modal close
const handleLogoutModalClose = () => {
  if (!isLoading.value) {
    showLogoutModal.value = false;
  }
};
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 shadow-md">
    <!-- Modern backdrop blur with enhanced glassmorphism -->
    <div
      class="absolute inset-0 backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800"
    ></div>

    <!-- Header container -->
    <header class="relative px-4 py-2">
      <div class="flex items-center justify-between mx-auto">
        <!-- Left side - App Title -->
        <div class="flex items-center space-x-4">
          <!-- App Logo/Icon -->
          <div class="relative">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 dark:shadow-sky-400/20"
            >
              <i class="bi bi-cup-hot text-white text-xl"></i>
            </div>
            <!-- Enhanced glow effect -->
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 opacity-20 blur-xl animate-pulse-slow"
            ></div>
          </div>

          <!-- App Title -->
          <div class="flex flex-col">
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 dark:from-sky-400 dark:via-sky-500 dark:to-sky-400 bg-clip-text text-transparent"
            >
              EA Invitation
            </h1>
            <p
              class="text-sm text-slate-600 dark:text-slate-300 -mt-1 font-medium"
            >
              Digital Wedding Invitation
            </p>
          </div>
        </div>

        <!-- Right side - User Menu -->
        <div class="relative">
          <!-- Menu Toggle Button -->
          <button
            @click="toggleMenu"
            class="flex items-center gap-x-3 p-1.5 rounded-2xl transition-all duration-300 group relative overflow-hidden"
            :class="[
              isMenuOpen
                ? 'bg-sky-500/90 text-white shadow-lg shadow-sky-500/25'
                : 'hover:bg-white/60 dark:hover:bg-slate-800/50 border border-transparent hover:border-sky-200/30 dark:hover:border-sky-600/30',
            ]"
          >
            <!-- User Avatar -->
            <div class="relative">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center overflow-hidden ring-2 transition-all duration-300"
                :class="[
                  isMenuOpen
                    ? 'ring-white/30'
                    : 'ring-transparent group-hover:ring-sky-400/30 dark:group-hover:ring-sky-500/30',
                ]"
              >
                <img
                  v-if="user?.avatar"
                  :src="user?.avatar"
                  :alt="user?.name"
                  class="w-full h-full object-cover"
                />
                <i
                  v-else
                  :class="[
                    'bi bi-person text-xl',
                    isMenuOpen ? 'text-white' : 'text-white',
                  ]"
                ></i>
              </div>
              <!-- Enhanced online status indicator -->
              <div
                class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-900 shadow-sm"
              >
                <div
                  class="absolute inset-0.5 bg-emerald-400 rounded-full animate-ping"
                ></div>
              </div>
            </div>

            <!-- Username (hidden on small screens) -->
            <span
              :class="[
                'hidden sm:block text-sm font-semibold transition-all duration-300',
                isMenuOpen
                  ? 'text-white drop-shadow-sm'
                  : 'text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400',
              ]"
            >
              {{ user?.name }}
            </span>

            <!-- Enhanced Dropdown Arrow -->
            <div class="relative">
              <svg
                :class="[
                  'w-5 h-5 transition-all duration-300',
                  isMenuOpen
                    ? 'rotate-180 text-white'
                    : 'text-slate-600 dark:text-slate-300 group-hover:text-sky-500 dark:group-hover:text-sky-400',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>

            <!-- Ripple effect for non-active state -->
            <div
              v-if="!isMenuOpen"
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/0 to-sky-600/0 group-hover:from-sky-500/5 group-hover:to-sky-600/5 transition-all duration-300 opacity-0 group-hover:opacity-100"
            ></div>
          </button>

          <!-- Enhanced Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div
              v-show="isMenuOpen"
              class="absolute right-0 top-full mt-3 w-72 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl border border-slate-200/30 dark:border-slate-800/30 overflow-hidden"
            >
              <!-- Floating gradient background -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-sky-50/30 to-sky-50/50 dark:from-sky-950/20 dark:via-sky-950/10 dark:to-sky-950/20"
              ></div>

              <!-- Menu Header -->
              <div
                class="relative p-4 border-b border-slate-200/20 dark:border-slate-800/30"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-sky-500/10 dark:from-sky-900/20 dark:via-sky-900/10 dark:to-sky-900/20"
                ></div>

                <div class="relative flex items-center space-x-4">
                  <div class="relative">
                    <div
                      class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center overflow-hidden shadow-lg shadow-sky-500/25"
                    >
                      <img
                        v-if="user?.avatar"
                        :src="user?.avatar"
                        :alt="user?.name"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="bi bi-person text-white text-3xl"></i>
                    </div>
                    <!-- Floating glow -->
                    <div
                      class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 opacity-20 blur-lg"
                    ></div>
                  </div>
                  <div class="flex-1">
                    <p
                      class="font-bold text-lg text-slate-900 dark:text-slate-50"
                    >
                      {{ user?.name || "Guest" }}
                    </p>
                    <p class="text-sm text-slate-600 dark:text-slate-300">
                      {{ user?.email || "guest@example.com" }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="relative pt-3">
                <!-- Profile -->
                <NuxtLink
                  to="/profile"
                  class="w-full flex items-center space-x-4 p-4 text-left hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-300 group relative overflow-hidden"
                >
                  <span
                    class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center group-hover:bg-sky-100 dark:group-hover:bg-sky-900/60 transition-all duration-300 shadow-sm"
                  >
                    <i
                      class="bi bi-person text-sky-600 dark:text-sky-400 text-xl"
                    ></i>
                  </span>
                  <span class="flex-1">
                    <p
                      class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                    >
                      Profil Saya
                    </p>
                    <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Kelola informasi profil
                    </p>
                  </span>
                  <i
                    class="bi bi-chevron-right text-slate-400 group-hover:text-sky-500 text-sm transition-colors duration-300"
                  ></i>
                </NuxtLink>

                <!-- Enhanced Divider -->
                <div class="my-4 px-6">
                  <div
                    class="h-px bg-gradient-to-r from-transparent via-slate-200/50 dark:via-slate-800/50 to-transparent"
                  ></div>
                </div>

                <!-- Theme Preferences -->
                <div class="px-6 mb-4">
                  <p
                    class="text-sm text-center font-medium text-slate-900 dark:text-slate-50 mb-3"
                  >
                    Tema Aplikasi
                  </p>

                  <div class="flex justify-center gap-3">
                    <ClientOnly>
                      <button
                        v-for="theme in themeOptions"
                        :key="theme.value"
                        @click="setTheme(theme.value)"
                        :class="[
                          'h-9 w-9 flex justify-center items-center rounded-xl transition-all duration-300 relative overflow-hidden group',
                          colorMode.preference === theme.value
                            ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25'
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50',
                        ]"
                      >
                        <!-- Active background glow -->
                        <div
                          v-if="colorMode.preference === theme.value"
                          class="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-600 opacity-20 blur-lg"
                        ></div>

                        <i class="bi relative z-10" :class="theme.icon"></i>

                        <!-- Hover effect -->
                        <div
                          v-if="colorMode.preference !== theme.value"
                          class="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500/0 to-sky-600/0 group-hover:from-sky-500/10 group-hover:to-sky-600/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        ></div>
                      </button>
                    </ClientOnly>
                  </div>
                </div>

                <!-- Enhanced Divider -->
                <div class="my-4 px-6">
                  <div
                    class="h-px bg-gradient-to-r from-transparent via-slate-200/50 dark:via-slate-800/50 to-transparent"
                  ></div>
                </div>

                <!-- Logout -->
                <button
                  @click="handleLogoutClick"
                  class="w-full flex items-center space-x-4 p-4 text-left hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <div
                    class="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/60 transition-all duration-300 shadow-sm"
                  >
                    <i
                      class="bi bi-box-arrow-right text-red-500 dark:text-red-400 text-xl"
                    ></i>
                  </div>
                  <div class="flex-1">
                    <p
                      class="text-sm font-semibold text-red-500 dark:text-red-400"
                    >
                      Keluar
                    </p>
                    <p
                      class="text-xs text-red-500/70 dark:text-red-400/70 mt-1"
                    >
                      Logout dari akun
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Logout Confirmation Modal -->
    <ConfirmDeleteModal
      :show="showLogoutModal"
      title="Logout Akun?"
      message="Apakah Anda yakin ingin keluar dari akun"
      :item-name="user?.name"
      :is-deleting="isLoading"
      confirm-text="Logout"
      cancel-text="Batal"
      type="danger"
      @close="handleLogoutModalClose"
      @confirm="handleConfirmLogout"
    >
      <div class="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-950">
        <p class="text-center text-sm text-slate-600 dark:text-slate-300">
          Anda harus login lagi untuk masuk ke menu EA Invitation
        </p>
      </div>
    </ConfirmDeleteModal>
  </div>
</template>

<style scoped>
/* Enhanced border styles */
.border-3 {
  border-width: 3px;
}
</style>
