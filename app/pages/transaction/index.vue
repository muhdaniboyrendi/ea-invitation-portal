<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "EA Invitation - Daftar Transaksi",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Daftar Transaksi",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Daftar Transaksi",
  twitterDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau.",
  twitterImage: "/og-image.png",
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Riwayat Transaksi"
          :has-button="false"
          icon="bi-wallet"
        />
        <UserTransactionList />
      </div>
    </NuxtLayout>
  </div>
</template>
