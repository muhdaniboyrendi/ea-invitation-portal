<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "EA Invitation - Pengisian Data Undangan",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Pengisian Data Undangan",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Pengisian Data Undangan",
  twitterDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau.",
  twitterImage: "/og-image.png",
});

const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Isi Undangan"
          subtitle="Siapkan data untuk mengisi data undangan anda."
          :has-button="false"
          icon="bi-envelope"
        />
        <UserInvitationFill />
      </div>
    </NuxtLayout>
  </div>
</template>
