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
  <div class="hidden lg:block fixed left-0 top-0 bottom-0 z-40 w-64 shadow-md">
    <!-- Modern backdrop blur -->
    <div
      class="absolute inset-0 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-r border-slate-200 dark:border-slate-800"
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
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25 dark:shadow-sky-400/20'
              : 'text-slate-900 dark:text-slate-50 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:shadow-sm',
          ]"
        >
          <!-- Active indicator -->
          <div
            v-if="activeTab === route.name"
            class="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 dark:bg-white rounded-r-full"
          ></div>

          <!-- Icon container -->
          <div
            :class="[
              'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
              activeTab === route.name
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-transparent group-hover:bg-sky-50 dark:group-hover:bg-slate-800/50',
            ]"
          >
            <i
              :class="[
                'bi text-lg transition-all duration-300',
                route.icon,
                activeTab === route.name
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400',
              ]"
            ></i>
          </div>

          <!-- Label -->
          <span
            :class="[
              'text-sm font-medium transition-all duration-300 relative z-10',
              activeTab === route.name
                ? 'text-white'
                : 'text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400',
            ]"
          >
            {{ route.label }}
          </span>

          <!-- Hover effect background -->
          <div
            v-if="activeTab !== route.name"
            class="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 to-sky-600/0 group-hover:from-sky-500/5 group-hover:to-sky-600/5 transition-all duration-300 opacity-0 group-hover:opacity-100"
          ></div>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
