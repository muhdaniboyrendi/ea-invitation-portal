<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <UserInvitationHeader />
        <UserInvitationList />
      </div>
    </NuxtLayout>
  </div>
</template>
