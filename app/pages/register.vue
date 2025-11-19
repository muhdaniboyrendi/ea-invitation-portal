<script setup>
definePageMeta({
  middleware: ["guest"],
});

useSeoMeta({
  title: "Daftar Akun Baru",
  description:
    "Bergabunglah dengan EA Invitation. Buat akun gratis dan mulai buat undangan pernikahan impianmu sekarang.",
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout name="auth">
      <AuthRegister />
    </NuxtLayout>
  </div>
</template>
