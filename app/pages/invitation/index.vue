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
          title="Daftar Undangan"
          button-text="Buat Undangan"
          :has-button="true"
          button-link="/invitation/create"
          icon="bi-envelope"
        />
        <UserInvitationList />
      </div>
    </NuxtLayout>
  </div>
</template>
