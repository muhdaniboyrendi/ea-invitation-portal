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
  <div class="relative mb-12 px-4 md:px-6">
    <!-- Header container -->
    <div>
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <!-- Title Section -->
        <div class="flex flex-col items-center gap-4 text-center">
          <div class="relative md:hidden">
            <div
              class="w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 dark:shadow-sky-400/20"
            >
              <i class="bi text-white text-3xl" :class="props.icon"></i>
            </div>
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 opacity-20 blur-xl animate-pulse-slow"
            ></div>
          </div>

          <div class="w-full flex flex-col">
            <h2
              class="text-2xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-600 dark:from-sky-400 dark:to-sky-400 bg-clip-text text-transparent"
            >
              {{ props.title }}
            </h2>
          </div>
        </div>

        <NuxtLink
          v-if="props.hasButton"
          :to="props.buttonLink"
          class="py-3 px-4 font-semibold text-center rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-sky-500/25"
        >
          {{ props.buttonText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
