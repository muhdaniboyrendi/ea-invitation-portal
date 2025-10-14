<template>
  <div class="relative group cursor-pointer">
    <!-- Skeleton Card Content -->
    <div
      class="relative p-4 md:p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10"
    >
      <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
        <!-- Transaction Info -->
        <div class="flex items-start space-x-4 flex-1">
          <!-- Transaction Icon Skeleton -->
          <div class="relative flex-shrink-0">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse"
            ></div>
          </div>

          <!-- Transaction Details Skeleton -->
          <div class="flex-1 min-w-0 space-y-3">
            <div class="space-y-2">
              <!-- Package Name Skeleton -->
              <div
                class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 animate-pulse"
              ></div>
              <!-- Payment Method Skeleton -->
              <div
                class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-32 animate-pulse"
              ></div>
            </div>
          </div>
        </div>

        <!-- Amount Skeleton -->
        <div class="space-y-2">
          <div
            class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-40 animate-pulse"
          ></div>
          <div
            class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-16 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Date and Time Skeleton -->
      <div class="flex items-center mt-4">
        <div class="flex items-center space-x-4">
          <!-- Date Skeleton -->
          <div class="flex items-center space-x-2">
            <div
              class="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            ></div>
            <div
              class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-24 animate-pulse"
            ></div>
          </div>

          <!-- Time Skeleton -->
          <div class="flex items-center space-x-2">
            <div
              class="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            ></div>
            <div
              class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-20 animate-pulse"
            ></div>
          </div>
        </div>
      </div>

      <!-- Status and Button Skeleton -->
      <div class="flex justify-between items-end mt-4">
        <!-- Status Badge Skeleton -->
        <div
          class="px-3 py-1 rounded-xl bg-gray-200 dark:bg-gray-700 w-24 h-7 animate-pulse"
        ></div>
        <!-- Button Skeleton -->
        <div
          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 w-32 h-11 animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>