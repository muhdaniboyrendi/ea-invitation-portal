<template>
  <!-- Desktop Sidebar Navigation -->
  <div class="hidden lg:block fixed left-0 top-0 bottom-0 z-40 w-64">
    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-purple-400/5 to-cyan-400/5 dark:from-cyan-400/20 dark:via-purple-400/20 dark:to-cyan-400/20"
    ></div>

    <!-- Navigation container -->
    <nav
      class="relative h-full flex flex-col p-6 bg-white/80 dark:bg-black/80 border-r border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="flex flex-col space-y-2 mt-18">
        <!-- Beranda -->
        <button
          @click="navigateTo('/')"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden w-full text-left',
            activeTab === 'beranda'
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg shadow-cyan-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'beranda'"
            class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Home Icon -->
          <svg
            class="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          <span class="text-base font-medium relative z-10">Beranda</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'beranda'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>

        <!-- Undangan -->
        <button
          @click="navigateTo('/undangan')"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden w-full text-left',
            activeTab === 'undangan'
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg shadow-purple-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'undangan'"
            class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Invitation Icon -->
          <svg
            class="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
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
          <span class="text-base font-medium relative z-10">Undangan</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'undangan'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>

        <!-- Transaksi -->
        <button
          @click="navigateTo('/transaksi')"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden w-full text-left',
            activeTab === 'transaksi'
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg shadow-cyan-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'transaksi'"
            class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Transaction Icon -->
          <svg
            class="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <span class="text-base font-medium relative z-10">Transaksi</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'transaksi'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>

        <!-- Menu -->
        <button
          @click="navigateTo('/menu')"
          :class="[
            'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden w-full text-left',
            activeTab === 'menu'
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg shadow-purple-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'menu'"
            class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Menu Icon -->
          <svg
            class="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <span class="text-base font-medium relative z-10">Menu</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'menu'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>
      </div>

      <!-- Active indicator line -->
      <div
        class="absolute top-0 left-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-400 opacity-30"
      ></div>
    </nav>
  </div>

  <!-- Mobile Bottom Navigation -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50">
    <!-- Background blur effect -->
    <div
      class="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50"
    ></div>

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-cyan-400/5 dark:from-cyan-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"
    ></div>

    <!-- Navigation container -->
    <nav class="relative px-6 py-2">
      <div class="flex justify-around items-center max-w-md mx-auto">
        <!-- Beranda -->
        <button
          @click="navigateTo('/')"
          :class="[
            'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden min-w-[60px]',
            activeTab === 'beranda'
              ? 'bg-gradient-to-br from-cyan-400 to-purple-400 text-white shadow-lg shadow-cyan-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'beranda'"
            class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Home Icon -->
          <svg
            class="w-6 h-6 mb-1 relative z-10 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          <span class="text-xs font-medium relative z-10">Beranda</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'beranda'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>

        <!-- Undangan -->
        <button
          @click="navigateTo('/undangan')"
          :class="[
            'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden min-w-[60px]',
            activeTab === 'undangan'
              ? 'bg-gradient-to-br from-cyan-400 to-purple-400 text-white shadow-lg shadow-purple-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-300',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'undangan'"
            class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Invitation Icon -->
          <svg
            class="w-6 h-6 mb-1 relative z-10 transition-transform duration-300 group-hover:scale-110"
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
          <span class="text-xs font-medium relative z-10">Undangan</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'undangan'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>

        <!-- Transaksi -->
        <button
          @click="navigateTo('/transaksi')"
          :class="[
            'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden min-w-[60px]',
            activeTab === 'transaksi'
              ? 'bg-gradient-to-br from-cyan-400 to-purple-400 text-white shadow-lg shadow-cyan-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'transaksi'"
            class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Transaction Icon -->
          <svg
            class="w-6 h-6 mb-1 relative z-10 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <span class="text-xs font-medium relative z-10">Transaksi</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'transaksi'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>

        <!-- Menu -->
        <button
          @click="navigateTo('/menu')"
          :class="[
            'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden min-w-[60px]',
            activeTab === 'menu'
              ? 'bg-gradient-to-br from-cyan-400 to-purple-400 text-white shadow-lg shadow-purple-400/25'
              : 'text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-300',
          ]"
        >
          <!-- Active background glow -->
          <div
            v-if="activeTab === 'menu'"
            class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-400 opacity-20 blur-xl"
          ></div>

          <!-- Menu Icon -->
          <svg
            class="w-6 h-6 mb-1 relative z-10 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <span class="text-xs font-medium relative z-10">Menu</span>

          <!-- Ripple effect -->
          <div
            v-if="activeTab !== 'menu'"
            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300"
          ></div>
        </button>
      </div>

      <!-- Active indicator line -->
      <div
        class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 opacity-30"
      ></div>
    </nav>
  </div>
</template>

<script setup>
// Reactive state for active tab
const route = useRoute();

// Compute active tab based on current route
const activeTab = computed(() => {
  const path = route.path;
  if (path === "/") return "beranda";
  if (path.startsWith("/undangan")) return "undangan";
  if (path.startsWith("/transaksi")) return "transaksi";
  if (path.startsWith("/menu")) return "menu";
  return "beranda";
});
</script>
