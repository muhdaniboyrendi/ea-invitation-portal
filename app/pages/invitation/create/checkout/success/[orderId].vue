<script setup>
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();

const orderId = route.params.orderId;

onMounted(() => {
  console.log("pages/", orderId);
});
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <UserInvitationCreateHeader />
        <UserInvitationCheckoutSuccess :order-id="orderId" />
      </div>
    </NuxtLayout>
  </div>
</template>
