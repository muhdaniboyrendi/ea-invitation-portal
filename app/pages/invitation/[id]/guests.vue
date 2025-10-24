<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Kelola Tamu Undangan"
          subtitle="Pantau, kelola, dan atur tamu undangan anda."
          :has-button="false"
          icon="bi-person-lines-fill"
        />
        <UserInvitationDetailGuestManage />
      </div>
    </NuxtLayout>
  </div>
</template>
