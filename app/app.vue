<script setup>
const { fetchCurrentUser } = useAuthStore();

onMounted(async () => {
  await fetchCurrentUser();
});
</script>

<template>
  <div class="font-primary">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </div>
</template>
