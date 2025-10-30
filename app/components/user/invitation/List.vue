<script setup>
const { userInvitations, userInvitationsPending } = storeToRefs(
  useInvitationStore()
);
</script>

<template>
  <div class="px-4 md:px-6">
    <UserInvitationSkeletonLoading v-if="userInvitationsPending" />

    <UserInvitationEmpty v-else-if="userInvitations.length === 0" />

    <div v-else class="grid gap-4">
      <UserInvitationCard
        v-for="invitation in userInvitations"
        :key="invitation.id"
        :invitation="invitation"
      />
    </div>
  </div>
</template>
