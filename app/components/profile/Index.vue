<script setup>
const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-4 md:space-y-6">
    <!-- Header -->
    <Header title="Profil Saya" :has-button="false" />

    <div class="grid lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6">
      <!-- Left Column -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Profile Card -->
        <ProfileCard :user="user" />
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Profile Information -->
        <ProfileUserInformation />

        <!-- Change Password -->
        <ProfileChangePassword v-if="!user?.google_id" />

        <!-- Danger Zone -->
        <!-- <ProfileDeleteAccount /> -->
      </div>
    </div>
  </div>
</template>
