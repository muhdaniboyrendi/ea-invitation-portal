<script setup>
const { handleGoogleCallback } = useAuthStore();
const route = useRoute();

onMounted(async () => {
  if (route.query.code) {
    try {
      handleGoogleCallback(route.query.code);
    } catch (error) {
      console.error("Failed to process authentication callback:", error);
      navigateTo(
        "/login?error=" +
          encodeURIComponent(error.message || "Authentication failed")
      );
    }
  } else {
    navigateTo(
      "/login?error=" + encodeURIComponent("Authentication data missing")
    );
  }
});
</script>

<template>
  <NuxtLayout name="auth">
    <div
      class="fixed inset-0 bg-off-white dark:bg-gray-900 z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <!-- Loading spinner -->
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
        ></div>

        <!-- Loading text -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Memuat...
        </h2>

        <p class="text-gray-600 dark:text-gray-400">
          Mohon tunggu sementara kami memproses autentikasi Anda.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
