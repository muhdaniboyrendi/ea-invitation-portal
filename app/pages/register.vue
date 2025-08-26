<script setup>
useHead({
  title: "EA Invitation - Daftar",
  meta: [
    {
      name: "description",
      content:
        "Daftar akun EA Invitation untuk mengelola dan mengedit undangan pernikahan digital Anda.",
    },
    // {
    //   name: "robots",
    //   content: "noindex, nofollow",
    // },
  ],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout name="auth">
      <AuthRegister />
    </NuxtLayout>
  </div>
</template>
