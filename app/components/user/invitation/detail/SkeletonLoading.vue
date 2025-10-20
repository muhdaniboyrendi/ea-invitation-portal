<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- 1. Invitation Card Skeleton -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between mb-6 gap-y-6">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse"
            ></div>
            <div class="space-y-2">
              <div
                class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-24 animate-pulse"
              ></div>
              <div
                class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 animate-pulse"
              ></div>
            </div>
          </div>
          <!-- Status Badge -->
          <div
            class="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        </div>

        <!-- Dates Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div
            class="p-3 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              ></div>
              <div class="flex-1 space-y-2">
                <div
                  class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-12 animate-pulse"
                ></div>
                <div
                  class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-24 animate-pulse"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="p-3 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              ></div>
              <div class="flex-1 space-y-2">
                <div
                  class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-12 animate-pulse"
                ></div>
                <div
                  class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-24 animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
          <div
            class="w-full h-12 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"
          ></div>
          <div
            class="w-full h-12 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"
          ></div>
        </div>
      </div>
    </div>

    <!-- 2. Theme Card Skeleton -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="h-12 w-12 rounded-2xl bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse"
          ></div>
          <div class="flex-1 space-y-2">
            <div
              class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-40 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-56 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Theme Details -->
        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
          >
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-20 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-32 animate-pulse"
            ></div>
          </div>

          <div
            class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
          >
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-20 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-24 animate-pulse"
            ></div>
          </div>

          <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
            <div
              class="w-full h-12 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"
            ></div>
            <div
              class="w-full h-12 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Order & Package Card Skeleton -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="h-12 w-12 rounded-2xl bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse"
          ></div>
          <div class="flex-1 space-y-2">
            <div
              class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-56 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Payment Status Badge -->
        <div class="mb-6 flex justify-between items-center">
          <div
            class="h-9 bg-gray-200 dark:bg-gray-700 rounded-full w-40 animate-pulse"
          ></div>
          <div
            class="h-11 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl w-48 animate-pulse"
          ></div>
        </div>

        <!-- Package Info -->
        <div
          class="mb-6 p-4 rounded-2xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
        >
          <div class="flex items-center justify-between">
            <div
              class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-32 animate-pulse"
            ></div>
            <div
              class="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-40 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
          >
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-16 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-32 animate-pulse"
            ></div>
          </div>
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
          >
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-24 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-28 animate-pulse"
            ></div>
          </div>
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
          >
            <div
              class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-28 animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-24 animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Guest List Card Skeleton -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-2xl bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse"
            ></div>
            <div class="space-y-2">
              <div
                class="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-32 animate-pulse"
              ></div>
              <div
                class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-56 animate-pulse"
              ></div>
            </div>
          </div>
          <div
            class="h-10 w-24 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse"
          ></div>
        </div>

        <!-- Guest List -->
        <div class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="p-4 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="h-12 w-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 animate-pulse"
                ></div>
                <div class="space-y-2">
                  <div
                    class="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-32 animate-pulse"
                  ></div>
                  <div
                    class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-28 animate-pulse"
                  ></div>
                </div>
              </div>
              <div
                class="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
