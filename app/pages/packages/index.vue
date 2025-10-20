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
          title="Paket Undangan"
          subtitle="Daftar Paket undangan yang tersedia untuk undangan anda."
          button-text="Tambah Paket"
          :has-button="user.role == 'admin' ? true : false"
          button-link="/packages/create"
          icon="bi-box"
        />
        <Package />
      </div>
    </NuxtLayout>
  </div>
</template>
