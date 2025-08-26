<template>
  <div class="fixed top-0 left-0 right-0 z-50">
    <!-- Background blur effect -->
    <div
      class="absolute inset-0 bg-white/85 dark:bg-black/85 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50"
    ></div>

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-cyan-400/5 dark:from-cyan-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"
    ></div>

    <!-- Header container -->
    <header class="relative px-4 py-3">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <!-- Left side - App Title -->
        <div class="flex items-center space-x-3">
          <!-- App Logo/Icon -->
          <div class="relative">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center shadow-lg shadow-cyan-400/25"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-400 opacity-20 blur-lg"
            ></div>
          </div>

          <!-- App Title -->
          <div>
            <h1
              class="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent"
            >
              EA Invitation
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Digital Event Platform
            </p>
          </div>
        </div>

        <!-- Right side - User Menu -->
        <div class="relative">
          <!-- Menu Toggle Button -->
          <button
            @click="toggleMenu"
            class="flex items-center space-x-2 p-2 rounded-xl transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group"
          >
            <!-- User Avatar -->
            <div class="relative">
              <div
                class="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-cyan-400/30 transition-all duration-300"
              >
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <!-- Online status indicator -->
              <div
                class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"
              ></div>
            </div>

            <!-- Username (hidden on small screens) -->
            <span
              class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300"
            >
              {{ user.username }}
            </span>

            <!-- Dropdown Arrow -->
            <svg
              :class="[
                'w-4 h-4 text-gray-500 dark:text-gray-400 transition-all duration-300',
                isMenuOpen
                  ? 'rotate-180 text-cyan-500'
                  : 'group-hover:text-cyan-500',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div
              v-show="isMenuOpen"
              class="absolute right-0 top-full mt-2 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <!-- Menu Header -->
              <div
                class="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-cyan-50/50 to-purple-50/50 dark:from-cyan-900/20 dark:to-purple-900/20"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="user.avatar"
                      :src="user.avatar"
                      :alt="user.name"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-gray-800 dark:text-gray-200">
                      {{ user.name }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      @{{ user.username }}
                    </p>
                    <p class="text-xs text-cyan-600 dark:text-cyan-400">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="py-2">
                <!-- Profile -->
                <button
                  @click="navigateToProfile"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Profil Saya
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Kelola informasi profil
                    </p>
                  </div>
                  <svg
                    class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>

                <!-- Theme Preferences -->
                <button
                  @click="toggleThemeMenu"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200"
                  >
                    <svg
                      v-if="currentTheme === 'light'"
                      class="w-4 h-4 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Tema Aplikasi
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{
                        currentTheme === "light" ? "Mode Terang" : "Mode Gelap"
                      }}
                    </p>
                  </div>
                  <svg
                    :class="[
                      'w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200',
                      isThemeMenuOpen ? 'rotate-90' : '',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>

                <!-- Theme Options (collapsible) -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-40"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="opacity-100 max-h-40"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-show="isThemeMenuOpen" class="overflow-hidden">
                    <div class="pl-8 pr-4 py-2 space-y-1">
                      <button
                        v-for="theme in themeOptions"
                        :key="theme.value"
                        @click="setTheme(theme.value)"
                        :class="[
                          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                          currentTheme === theme.value
                            ? 'bg-gradient-to-r from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30 text-cyan-700 dark:text-cyan-300'
                            : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400',
                        ]"
                      >
                        <component :is="theme.icon" class="w-4 h-4" />
                        <span class="text-sm">{{ theme.label }}</span>
                        <svg
                          v-if="currentTheme === theme.value"
                          class="w-4 h-4 text-cyan-500 ml-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </Transition>

                <!-- Divider -->
                <div
                  class="my-2 border-t border-gray-200/50 dark:border-gray-700/50"
                ></div>

                <!-- Logout -->
                <button
                  @click="handleLogout"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p
                      class="text-sm font-medium text-red-600 dark:text-red-400"
                    >
                      Keluar
                    </p>
                    <p class="text-xs text-red-500/70 dark:text-red-400/70">
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
  </div>
</template>

<script setup>
// Reactive states
const isMenuOpen = ref(false);
const isThemeMenuOpen = ref(false);

// User data (this would typically come from a store or API)
const user = ref({
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  avatar: null, // Set to image URL if available
});

// Theme management
const currentTheme = ref("light");

const themeOptions = [
  {
    value: "light",
    label: "Mode Terang",
    icon: "SunIcon",
  },
  {
    value: "dark",
    label: "Mode Gelap",
    icon: "MoonIcon",
  },
  {
    value: "system",
    label: "Ikuti Sistem",
    icon: "ComputerIcon",
  },
];

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isThemeMenuOpen.value = false;
  }
};

const toggleThemeMenu = () => {
  isThemeMenuOpen.value = !isThemeMenuOpen.value;
};

const navigateToProfile = () => {
  navigateTo("/profile");
  isMenuOpen.value = false;
};

const setTheme = (theme) => {
  currentTheme.value = theme;
  // Implementation for theme switching
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // System theme
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  }

  // Save to localStorage
  localStorage.setItem("theme", theme);
  isThemeMenuOpen.value = false;
};

const handleLogout = () => {
  // Implementation for logout
  console.log("Logging out...");
  // Clear user session, redirect to login, etc.
  navigateTo("/login");
  isMenuOpen.value = false;
};

// Close menu when clicking outside
const closeMenus = () => {
  isMenuOpen.value = false;
  isThemeMenuOpen.value = false;
};

// Handle outside clicks
onMounted(() => {
  document.addEventListener("click", (event) => {
    const menuElement = event.target.closest(".relative");
    if (!menuElement || !menuElement.contains(event.target)) {
      closeMenus();
    }
  });

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "system";
  setTheme(savedTheme);
});

onUnmounted(() => {
  document.body.classList.remove("pt-20");
});

// Icon components (simplified SVG icons)
const SunIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
  `,
};

const MoonIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
  `,
};

const ComputerIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
  `,
};
</script>

<style scoped></style>
