<script setup>
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Tentang Kami - EA Invitation",
  meta: [
    {
      name: "description",
      content:
        "Kenali lebih dekat EA Invitation - platform undangan digital terdepan dengan 4+ tahun pengalaman, 500+ proyek selesai, dan komitmen terhadap kualitas dan inovasi.",
    },
    {
      property: "og:title",
      content: "Tentang Kami - EA Invitation",
    },
    {
      property: "og:description",
      content:
        "Kenali lebih dekat EA Invitation - platform undangan digital terdepan dengan 4+ tahun pengalaman, 500+ proyek selesai, dan komitmen terhadap kualitas dan inovasi.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <UserMenuAboutUs />
      </div>
    </NuxtLayout>
  </div>
</template>
