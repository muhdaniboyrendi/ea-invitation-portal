<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="space-y-6">
        <Header
          title="Menu"
          :has-button="false"
          icon="bi-list"
        />
        <UserMenuList />
        <UserMenuProfile />
      </div>
    </NuxtLayout>
  </div>
</template>
