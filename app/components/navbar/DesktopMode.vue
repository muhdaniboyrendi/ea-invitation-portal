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
  <div class="hidden lg:block fixed left-0 top-0 bottom-0 z-40 w-64">
    <!-- Modern backdrop blur -->
    <div
      class="absolute inset-0 backdrop-blur-xl bg-off-white/80 dark:bg-gray-900/80 border-r border-white/20 dark:border-gray-700/30"
    ></div>

    <!-- Navigation container -->
    <nav class="relative h-full flex flex-col p-6">
      <!-- Navigation links -->
      <div class="flex flex-col space-y-2 mt-16">
        <NuxtLink
          v-for="(route, index) in filteredRoutes"
          :key="index"
          :to="route.path"
          :class="[
            'group relative flex items-center space-x-4 p-2.5 rounded-2xl transition-all duration-300 ease-out',
            activeTab === route.name
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-gray-800/50 hover:shadow-sm',
          ]"
        >
          <!-- Active indicator -->
          <div
            v-if="activeTab === route.name"
            class="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-dark dark:bg-white rounded-r-full"
          ></div>

          <!-- Icon container -->
          <div
            :class="[
              'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
              activeTab === route.name
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-transparent group-hover:bg-blue-50 dark:group-hover:bg-gray-700/50',
            ]"
          >
            <i
              :class="[
                'bi text-lg transition-all duration-300',
                route.icon,
                activeTab === route.name
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
              ]"
            ></i>
          </div>

          <!-- Label -->
          <span
            :class="[
              'text-sm font-medium transition-all duration-300 relative z-10',
              activeTab === route.name
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400',
            ]"
          >
            {{ route.label }}
          </span>

          <!-- Hover effect background -->
          <div
            v-if="activeTab !== route.name"
            class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100"
          ></div>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
