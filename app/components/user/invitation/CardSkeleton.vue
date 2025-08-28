<template>
  <div
    class="relative bg-white dark:bg-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <!-- Shimmer Effect Background -->
    <div
      class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent"
    ></div>

    <!-- Card Content -->
    <div class="relative p-6">
      <!-- Header Skeleton -->
      <div
        class="flex flex-col-reverse sm:flex-row items-center justify-between mb-6 gap-y-4"
      >
        <div class="flex items-center space-x-3">
          <!-- Icon Skeleton -->
          <div
            class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
          ></div>
          <div class="space-y-2">
            <!-- Title Skeleton -->
            <div
              class="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
            <!-- Subtitle Skeleton -->
            <div
              class="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Status Badge Skeleton -->
        <div
          class="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
        ></div>
      </div>

      <!-- Stats Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          v-for="i in 3"
          :key="i"
          class="text-center p-4 bg-off-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <!-- Stat Icon Skeleton -->
          <div
            class="w-10 h-10 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
          ></div>
          <!-- Stat Number Skeleton -->
          <div
            class="w-8 h-6 mx-auto mb-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
          <!-- Stat Label Skeleton -->
          <div
            class="w-16 h-3 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Dates Info Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          v-for="i in 2"
          :key="i"
          class="p-3 bg-off-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center space-x-3">
            <!-- Date Icon Skeleton -->
            <div
              class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            ></div>
            <div class="space-y-1">
              <!-- Date Label Skeleton -->
              <div
                class="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
              <!-- Date Value Skeleton -->
              <div
                class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          v-for="i in 3"
          :key="i"
          class="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Enhanced pulse animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
