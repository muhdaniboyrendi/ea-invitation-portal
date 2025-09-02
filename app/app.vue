<script setup>
const { fetchCurrentUser } = useAuthStore();

// onBeforeMount(async () => {
//   await fetchCurrentUser();
// });
</script>

<template>
  <div class="font-primary">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </div>
</template>
