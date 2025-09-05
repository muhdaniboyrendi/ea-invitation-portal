<script setup>
// const { fetchUser } = useAuthStore();
// const { user } = storeToRefs(useAuthStore());

// await useAsyncData("initial-user-fetch", async () => {
//   // Hanya jalankan jika user belum ada
//   if (!user.value) {
//     try {
//       await fetchUser();
//       console.log("User session restored on initial load.");
//     } catch (e) {
//       // Tidak apa-apa jika gagal, berarti user tidak login
//       console.log("No active session on initial load.", e);
//     }
//   }
// });
</script>

<template>
  <div class="font-primary">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </div>
</template>
