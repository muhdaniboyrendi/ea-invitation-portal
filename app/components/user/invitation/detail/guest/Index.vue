<!-- UserInvitationDetailGuest -->
<script setup>
const props = defineProps(["invitationData"]);

const totalGuests = computed(() => props.invitationData.guests.length);
const attendingGuests = computed(
  () =>
    props.invitationData.guests.filter(
      (guest) => guest.attendance_status === "attending"
    ).length
);
const notAttendingGuests = computed(
  () =>
    props.invitationData.guests.filter(
      (guest) => guest.attendance_status === "not_attending"
    ).length
);
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6"
  >
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
      >
        <i class="bi bi-people-fill text-sky-500 text-lg"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h2
          class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
        >
          Daftar Tamu
        </h2>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          Kelola dan pantau daftar tamu undangan
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-2 md:gap-3">
      <!-- Total Tamu -->
      <div
        class="text-center p-3 md:p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800"
      >
        <div
          class="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-sky-500 flex items-center justify-center"
        >
          <i class="bi bi-people text-white text-sm md:text-base"></i>
        </div>
        <p
          class="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-50"
        >
          {{ totalGuests }}
        </p>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Total Tamu
        </p>
      </div>

      <!-- Hadir -->
      <div
        class="text-center p-3 md:p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800"
      >
        <div
          class="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-emerald-500 flex items-center justify-center"
        >
          <i class="bi bi-check-circle text-white text-sm md:text-base"></i>
        </div>
        <p
          class="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-50"
        >
          {{ attendingGuests }}
        </p>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Hadir</p>
      </div>

      <!-- Tidak Hadir -->
      <div
        class="text-center p-3 md:p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800"
      >
        <div
          class="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-red-500 flex items-center justify-center"
        >
          <i class="bi bi-x-circle text-white text-sm md:text-base"></i>
        </div>
        <p
          class="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-50"
        >
          {{ notAttendingGuests }}
        </p>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Tidak Hadir
        </p>
      </div>
    </div>

    <!-- Action Button -->
    <NuxtLink
      :to="`/invitation/${props.invitationData.id}/guests`"
      class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <i class="bi bi-person-lines-fill"></i>
      <span>Kelola Tamu</span>
    </NuxtLink>
  </div>
</template>
