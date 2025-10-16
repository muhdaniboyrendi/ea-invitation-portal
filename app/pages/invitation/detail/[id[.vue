<script setup>
const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Buat Undangan"
          subtitle="Siapkan data untuk membuat undangan anda."
          :has-button="false"
          icon="bi-envelope"
        />
        <UserInvitationDetail />
      </div>
    </NuxtLayout>
  </div>
</template>
