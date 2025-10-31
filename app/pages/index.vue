<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="space-y-4 md:space-y-6">
        <UserHomeHero />
        <UserHomeLatestInvitation />
        <UserMenuList />
      </div>
    </NuxtLayout>
  </div>
</template>
