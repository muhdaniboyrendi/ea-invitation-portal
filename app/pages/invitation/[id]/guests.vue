<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "EA Invitation - Kelola Tamu Undangan",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Kelola Tamu Undangan",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Kelola Tamu Undangan",
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
          title="Kelola Tamu Undangan"
          subtitle="Pantau, kelola, dan atur tamu undangan anda."
          :has-button="false"
          icon="bi-person-lines-fill"
        />
        <UserInvitationDetailGuestManage />
      </div>
    </NuxtLayout>
  </div>
</template>
