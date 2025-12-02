<script setup>
definePageMeta({
  middleware: ["guest"],
});

useSeoMeta({
  title: "Masuk ke Akun Anda",
  titleTemplate: "%s - EA Invitation Dashboard",
  description:
    "Masuk ke dashboard EA Invitation untuk mulai membuat dan mengelola undangan pernikahan digital Anda.",
  // Mencegah Google meng-cache halaman login (untuk keamanan)
  robots: "index, noarchive",
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout name="auth">
      <AuthLogin />
    </NuxtLayout>
  </div>
</template>
