<script setup>
const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Isi Undangan"
          subtitle="Siapkan data untuk mengisi data undangan anda."
          :has-button="false"
          icon="bi-envelope"
        />
        <UserInvitationFill />
      </div>
    </NuxtLayout>
  </div>
</template>
