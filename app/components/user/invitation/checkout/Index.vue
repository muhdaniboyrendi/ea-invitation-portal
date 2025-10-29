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

  <div v-else>
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
