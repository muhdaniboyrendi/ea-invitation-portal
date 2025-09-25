<script setup>
const { user } = useAuthStore();
const route = useRoute();

const routelist = ref([
  {
    name: "beranda",
    label: "Beranda",
    path: "/",
    role: "user",
    icon: "bi-house-door",
  },
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    role: "admin",
    icon: "bi-graph-up-arrow",
  },
  {
    name: "paket",
    label: "Paket",
    path: "/packages",
    role: "admin",
    icon: "bi-box-seam",
  },
  {
    name: "tema",
    label: "Tema",
    path: "/themes",
    role: "admin",
    icon: "bi-palette2",
  },
  {
    name: "musik",
    label: "Musik",
    path: "/musics",
    role: "admin",
    icon: "bi-music-note-list",
  },
  {
    name: "undangan",
    label: "Undangan",
    path: "/invitation",
    role: "user",
    icon: "bi-envelope",
  },
  {
    name: "transaksi",
    label: "Transaksi",
    path: "/transaction",
    role: "user",
    icon: "bi-wallet2",
  },
  { name: "menu", label: "Menu", path: "/menu", role: "user", icon: "bi-list" },
]);

const filteredRoutes = computed(() => {
  return routelist.value.filter((routeItem) => routeItem.role === user.role);
});

const activeTab = computed(() => {
  const path = route.path;
  const activeRoute = filteredRoutes.value.find((route) => route.path === path);
  return activeRoute ? activeRoute.name : "beranda";
});
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50">
    <!-- Modern backdrop blur with enhanced glassmorphism -->
    <div
      class="absolute inset-0 backdrop-blur-2xl bg-off-white/80 dark:bg-gray-900/80 border-t border-white/20 dark:border-gray-700/30"
    ></div>

    <!-- Floating accent line at top -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-full opacity-60"
    ></div>

    <!-- Navigation container -->
    <nav class="relative px-6 py-2">
      <div class="flex justify-around items-center max-w-sm mx-auto">
        <NuxtLink
          v-for="(route, index) in filteredRoutes"
          :key="index"
          :to="route.path"
          class="group relative flex flex-col items-center justify-center transition-all duration-300 ease-out"
        >
          <!-- Icon container -->
          <div
            class="relative flex items-center justify-center w-8 h-8 mb-1 transition-all duration-300"
            :class="[
              activeTab === route.name
                ? 'transform scale-110'
                : 'group-hover:scale-105',
            ]"
          >
            <i
              :class="[
                'bi text-lg transition-all duration-300',
                route.icon,
                activeTab === route.name
                  ? 'text-cyan-500 drop-shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white',
              ]"
            ></i>

            <!-- Subtle glow effect for active icon -->
            <div
              v-if="activeTab === route.name"
              class="absolute inset-0 bg-cyan-300/20 rounded-full blur-sm -z-10"
            ></div>
          </div>

          <!-- Label with enhanced typography -->
          <span
            :class="[
              'text-xs font-medium transition-all duration-300 relative z-10',
              activeTab === route.name
                ? 'text-cyan-500 drop-shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white',
            ]"
          >
            {{ route.label }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Safe area padding for devices with home indicator -->
    <div class="h-safe-area-inset-bottom bg-transparent"></div>
  </div>
</template>

<style scoped>
/* Safe area support for devices with home indicator */
.h-safe-area-inset-bottom {
  height: env(safe-area-inset-bottom, 0px);
}
</style>
