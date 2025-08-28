<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 sm:pt-8 md:p-8 md:pt-12 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <!-- Shimmer Effect Background -->
    <div class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent"></div>
    
    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Left Column - Order Summary Skeleton -->
      <div class="space-y-6">
        <div
          class="bg-white dark:bg-dark rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="relative p-6">
            <!-- Header Skeleton -->
            <div class="flex items-center mb-6">
              <div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-3"></div>
              <div class="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <!-- Order Item Skeleton -->
            <div class="space-y-4">
              <div
                class="flex items-center space-x-4 p-4 rounded-2xl bg-off-white dark:bg-gray-900 border border-white/20 dark:border-gray-700/20"
              >
                <!-- Item Image Skeleton -->
                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>

                <!-- Item Details Skeleton -->
                <div class="flex-1 space-y-2">
                  <div class="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Price Summary Skeleton -->
            <div class="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
              <!-- Subtotal -->
              <div class="flex justify-between">
                <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <!-- Discount -->
              <div class="flex justify-between">
                <div class="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <!-- Admin Fee -->
              <div class="flex justify-between">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <!-- Divider -->
              <div class="h-px bg-gray-200 dark:bg-gray-700"></div>
              
              <!-- Total -->
              <div class="flex justify-between">
                <div class="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-28 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Payment Form Skeleton -->
      <div class="space-y-6">
        <!-- Promo Code Skeleton -->
        <div
          class="bg-white dark:bg-dark rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="relative p-4">
            <div class="flex space-x-3">
              <!-- Promo Input Skeleton -->
              <div class="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <!-- Apply Button Skeleton -->
              <div class="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Payment Button Skeleton -->
        <div class="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
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
  0%, 100% {
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