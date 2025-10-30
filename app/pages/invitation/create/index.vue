<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header title="Buat Undangan" :has-button="false" icon="bi-envelope" />
        <p
          class="font-semibold text-center text-dark dark:text-white text-xl md:mb-10"
        >
          Pilih paket undangan anda
        </p>
        <UserInvitationCreateSelection />
      </div>
    </NuxtLayout>
  </div>
</template>
