<!-- pages/auth/google/callback.vue -->
<script setup>
useSeoMeta({
  title: "EA Invitation - Auth",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Auth",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Auth",
  twitterDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau.",
  twitterImage: "/og-image.png",
});

const { handleGoogleCallback } = useAuthStore();
const route = useRoute();

onMounted(async () => {
  if (route.query.code) {
    try {
      await handleGoogleCallback(route.query.code, route.query.state);
    } catch (error) {
      console.error("Failed to process authentication callback:", error);
      console.error(error.validationErrors);
      await navigateTo(
        "/login?error=" +
          encodeURIComponent(error.message || "Authentication failed")
      );
    }
  } else {
    await navigateTo(
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