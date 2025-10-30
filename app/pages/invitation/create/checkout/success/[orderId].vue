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
      <UserInvitationCheckoutSuccess :order-id="orderId" />
    </NuxtLayout>
  </div>
</template>
