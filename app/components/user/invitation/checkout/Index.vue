<script setup>
const { fetchPackage } = usePackageStore();
const route = useRoute();

const packageId = route.params.id;
const packageDetails = ref(null);
const pending = ref(true);

const adminFee = ref(2500);

const loadPackage = async () => {
  pending.value = true;
  try {
    const response = await fetchPackage(packageId);

    packageDetails.value = response;
  } catch (error) {
    console.error("Error loading package:", error);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadPackage();
});
</script>

<template>
  <UserInvitationCheckoutSkeleton v-if="pending" />

  <div
    v-else
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <!-- Main Content -->
    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Left Column - Order Summary -->
      <div class="space-y-6">
        <!-- Order Items -->
        <UserInvitationCheckoutOrderItem
          :package="packageDetails"
          :admin-fee="adminFee"
        />
      </div>

      <!-- Right Column - Payment Form -->
      <div class="space-y-6">
        <!-- Payment Method -->
        <!-- <UserInvitationCheckoutPaymentMethod /> -->

        <!-- Action Buttons -->
        <UserInvitationCheckoutActionButton :package="packageDetails" />
      </div>
    </div>
  </div>
</template>
