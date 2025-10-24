<script setup>
const { fetchInvitation } = useInvitationStore();
const route = useRoute();

const id = route.params.id;

const pending = ref(true);
const invitationData = ref({});

const loadInvitation = async () => {
  pending.value = true;

  try {
    const response = await fetchInvitation(id);
    invitationData.value = response;
  } catch (error) {
    console.error(error);
    console.error(error.status);
    console.error(error.validationErrors);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadInvitation();
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <UserInvitationDetailSkeletonLoading v-if="pending" />

    <!-- Main Content -->
    <div v-else class="max-w-6xl mx-auto space-y-6">
      <!-- 1. Invitation Card -->
      <UserInvitationDetailInvitation
        :invitation-data="invitationData"
        @updated="loadInvitation"
      />

      <!-- 2. Theme Card -->
      <UserInvitationDetailTheme :invitation-data="invitationData" />

      <!-- 3. Order & Package Card -->
      <UserInvitationDetailOrder :invitation-data="invitationData" />

      <!-- 4. Guest List Card -->
      <UserInvitationDetailGuest :invitation-data="invitationData" />
    </div>
  </div>
</template>
