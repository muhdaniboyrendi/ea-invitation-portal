<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: false,
  },
  routeList: {
    type: Array,
    required: true,
  },
});

const route = useRoute();

const filteredRoutes = computed(() => {
  return props.routeList.filter(
    (routeItem) => routeItem.role === props.user?.role
  );
});

const activeTab = computed(() => {
  const currentPath = route.path;

  // Cari route yang path-nya cocok dengan awalan currentPath
  const activeRoute = filteredRoutes.value.find((routeItem) => {
    // Untuk home/beranda, harus exact match
    if (routeItem.path === "/") {
      return currentPath === "/";
    }
    // Untuk route lainnya, cek apakah currentPath dimulai dengan route.path
    return currentPath.startsWith(routeItem.path);
  });

  return activeRoute ? activeRoute.name : "beranda";
});
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50">
    <!-- Modern backdrop blur with enhanced glassmorphism -->
    <div
      class="absolute inset-0 backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-t border-slate-200/20 dark:border-slate-800/30"
    ></div>

    <!-- Floating accent line at top -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-sky-500 to-sky-600 rounded-b-full opacity-60"
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
                  ? 'text-sky-500 drop-shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50',
              ]"
            ></i>

            <!-- Subtle glow effect for active icon -->
            <div
              v-if="activeTab === route.name"
              class="absolute inset-0 bg-sky-400/20 rounded-full blur-sm -z-10"
            ></div>
          </div>

          <!-- Label with enhanced typography -->
          <span
            :class="[
              'text-xs font-medium transition-all duration-300 relative z-10',
              activeTab === route.name
                ? 'text-sky-500 drop-shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50',
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
