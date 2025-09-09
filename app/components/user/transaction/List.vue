<script setup>
const { userOrders } = storeToRefs(useOrderStore());
</script>

<template>
  <div class="grid gap-4">
    <UserTransactionCard
      v-for="order in userOrders"
      :key="order.id"
      :order="order"
    />
  </div>
</template>
