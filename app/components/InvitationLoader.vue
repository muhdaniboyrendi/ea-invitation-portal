<script setup>
const route = useRoute();

const invitationSlug = route.params.invitationSlug;
</script>

<template>
  <div
    class="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50 flex items-center justify-center overflow-hidden"
  >
    <!-- Main content -->
    <div class="relative z-10 text-center px-4">
      <!-- Loading spinner -->
      <div
        class="inline-block animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mb-10"
      ></div>

      <!-- Loading text with animation -->
      <div class="space-y-3">
        <h2
          class="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-500 animate-fade-in"
        >
          Memuat Undangan
        </h2>

        <!-- Animated dots -->
        <div class="flex items-center justify-center gap-2">
          <p class="text-gray-600 dark:text-gray-400 text-base">
            Mohon tunggu sebentar...
          </p>
          <span class="flex gap-1">
            <span
              class="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce-dot"
            ></span>
            <span
              class="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce-dot animation-delay-200"
            ></span>
            <span
              class="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce-dot animation-delay-400"
            ></span>
          </span>
        </div>

        <!-- Progress bar -->
        <div
          class="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden"
        >
          <div
            class="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-progress"
          ></div>
        </div>

        <!-- Brand -->
        <div class="pt-4 animate-fade-in-delay">
          <p
            class="text-3xl w-fit mx-auto font-bold bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            EA Invitation
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.6s ease-out 0.3s both;
}

.animate-progress {
  animation: progress 5s ease-in-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
