<script setup>
definePageMeta({
  middleware: ["guest"],
});

useSeoMeta({
  title: "EA Invitation - Masuk",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Masuk",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Masuk",
  twitterDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau.",
  twitterImage: "/og-image.png",
});

useSchemaOrg([
  {
    "@type": "WebSite",
    name: "EA Invitation",
    url: "/",
    potentialAction: {
      "@type": "SearchAction",
      target: "/themes?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@type": "Organization",
    name: "EA Invitation",
    url: "/",
    logo: "/favicon.ico",
    sameAs: [
      "https://instagram.com/ea.invitation",
      "https://tiktok.com/ea.invitation",
    ],
  },
]);
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout name="auth">
      <AuthLogin />
    </NuxtLayout>
  </div>
</template>
