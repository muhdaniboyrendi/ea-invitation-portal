<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Title",
  },
  subtitle: {
    type: [Boolean, String],
    default: false,
  },
  icon: {
    type: String,
    default: "bi-box",
  },
  hasButton: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: "Button",
  },
  buttonLink: {
    type: String,
    default: "/",
  },
});
</script>

<template>
  <div class="relative">
    <!-- Header container -->
    <div
      class="relative p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10 shadow-xl"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-8"
      >
        <!-- Title Section -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20"
            >
              <i class="bi text-white text-xl" :class="props.icon"></i>
            </div>
            <!-- Enhanced glow effect -->
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-xl animate-pulse-slow"
            ></div>
          </div>

          <div class="flex flex-col">
            <h2
              class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
            >
              {{ props.title }}
            </h2>
            <p v-if="props.subtitle" class="text-gray-600 dark:text-gray-400">
              {{ props.subtitle }}
            </p>
          </div>
        </div>

        <NuxtLink
          v-if="props.hasButton"
          :to="props.buttonLink"
          class="py-3 px-4 font-semibold text-center rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {{ props.buttonText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
