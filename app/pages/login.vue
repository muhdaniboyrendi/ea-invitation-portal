<script setup>
useHead({
  title: "EA Invitation - Login ke Dashboard",
  meta: [
    {
      name: "description",
      content:
        "Login ke akun EA Invitation untuk mengelola dan mengedit undangan pernikahan digital Anda.",
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
      <AuthLogin />
    </NuxtLayout>
  </div>
</template>
