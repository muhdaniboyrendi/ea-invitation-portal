<script setup>
const props = defineProps({
  guests: {
    type: Array,
    default: () => [],
  },
});

const totalGuests = computed(() => props.guests.length);

const attendingGuests = computed(
  () =>
    props.guests.filter((guest) => guest.attendance_status === "attending")
      .length
);

const notAttendingGuests = computed(
  () =>
    props.guests.filter((guest) => guest.attendance_status === "not_attending")
      .length
);

const pendingGuests = computed(
  () =>
    props.guests.filter(
      (guest) =>
        guest.attendance_status === "pending" || !guest.attendance_status
    ).length
);
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
    <!-- Total Tamu -->
    <div
      class="text-center bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6"
    >
      <div
        class="w-9 h-9 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-sky-500 flex items-center justify-center"
      >
        <i class="bi bi-people text-white text-sm md:text-base"></i>
      </div>
      <p
        class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50"
      >
        {{ totalGuests }}
      </p>
      <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Total Tamu</p>
    </div>

    <!-- Hadir -->
    <div
      class="text-center bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6"
    >
      <div
        class="w-9 h-9 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-emerald-500 flex items-center justify-center"
      >
        <i class="bi bi-check-circle text-white text-sm md:text-base"></i>
      </div>
      <p
        class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50"
      >
        {{ attendingGuests }}
      </p>
      <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Hadir</p>
    </div>

    <!-- Tidak Hadir -->
    <div
      class="text-center bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6"
    >
      <div
        class="w-9 h-9 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-red-500 flex items-center justify-center"
      >
        <i class="bi bi-x-circle text-white text-sm md:text-base"></i>
      </div>
      <p
        class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50"
      >
        {{ notAttendingGuests }}
      </p>
      <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Tidak Hadir</p>
    </div>

    <!-- Pending -->
    <div
      class="text-center bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6"
    >
      <div
        class="w-9 h-9 md:w-10 md:h-10 mx-auto mb-2 rounded-xl bg-amber-500 flex items-center justify-center"
      >
        <i class="bi bi-hourglass-split text-white text-sm md:text-base"></i>
      </div>
      <p
        class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50"
      >
        {{ pendingGuests }}
      </p>
      <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Pending</p>
    </div>
  </div>
</template>
