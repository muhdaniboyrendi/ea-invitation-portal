<!-- UserInvitationDetailGuest -->
<script setup>
const props = defineProps(["invitationData"]);
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
  >
    <div class="relative p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div
            class="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center shadow-lg"
          >
            <i class="bi bi-people-fill text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Daftar Tamu
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Kelola dan pantau daftar tamu undangan
            </p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          class="text-center p-4 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center"
          >
            <i class="bi bi-people text-blue-600 dark:text-blue-400"></i>
          </div>
          <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {{ props.invitationData.guests.length }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400">Total Tamu</p>
        </div>

        <div
          class="text-center p-4 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 flex items-center justify-center"
          >
            <i
              class="bi bi-check-circle text-green-600 dark:text-green-400"
            ></i>
          </div>
          <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {{
              props.invitationData.guests.filter((guest) => {
                guest.attendance_status == "attending";
              }).length
            }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400">Hadir</p>
        </div>

        <div
          class="text-center p-4 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 flex items-center justify-center"
          >
            <i class="bi bi-x-circle text-red-600 dark:text-red-400"></i>
          </div>
          <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {{
              props.invitationData.guests.filter((guest) => {
                guest.attendance_status == "not_attending";
              }).length
            }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400">Tidak Hadir</p>
        </div>
      </div>

      <NuxtLink
        :to="`/invitation/${props.invitationData.id}/guests`"
        class="w-full block py-3 px-6 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-center font-semibold hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <i class="bi bi-person-lines-fill mr-2"></i>
        Kelola Tamu
      </NuxtLink>
    </div>
  </div>
</template>
