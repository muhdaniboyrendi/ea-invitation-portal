<script setup>
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();

const invitationId = route.params.id;
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <Header
          title="Ubah Tema"
          subtitle="Pilih dan ubah tema undanganmu kapan pun."
          :has-button="false"
          icon="bi-palette2"
        />
        <UserInvitationDetailThemeSelection />
      </div>
    </NuxtLayout>
  </div>
</template>
