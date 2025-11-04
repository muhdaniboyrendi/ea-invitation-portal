<script setup>
definePageMeta({
  middleware: ["auth"],
});

const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Detail Undangan"
          :has-button="false"
          icon="bi-envelope"
        />
        <UserInvitationDetail />
      </div>
    </NuxtLayout>
  </div>
</template>
