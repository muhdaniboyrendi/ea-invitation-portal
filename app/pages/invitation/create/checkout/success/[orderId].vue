<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "EA Invitation - Pesanan Berhasil",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Pesanan Berhasil",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Pesanan Berhasil",
  twitterDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau.",
  twitterImage: "/og-image.png",
});

const route = useRoute();

const orderId = route.params.orderId;

onMounted(() => {
  console.log("pages/", orderId);
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <UserInvitationCheckoutSuccess :order-id="orderId" />
    </NuxtLayout>
  </div>
</template>
