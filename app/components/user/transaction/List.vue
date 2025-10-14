<script setup>
const { userOrders, userOrdersPending } = storeToRefs(useOrderStore());
</script>

<template>
  <div>
    <div v-if="userOrdersPending" class="grid gap-4">
      <UserTransactionSkeletonLoading v-for="(n, index) in 3" :key="index" />
    </div>

    <UserTransactionEmpty v-else-if="userOrders.length === 0" />

    <div v-else class="grid gap-4">
      <UserTransactionCard
        v-for="order in userOrders"
        :key="order.id"
        :order="order"
      />
    </div>
  </div>
</template>
