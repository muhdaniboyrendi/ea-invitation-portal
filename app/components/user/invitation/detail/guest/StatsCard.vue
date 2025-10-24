<script setup>
const props = defineProps({
  guests: {
    type: Array,
  },
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div
      class="text-center p-4 bg-white dark:bg-dark rounded-3xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div
        class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center"
      >
        <i class="bi bi-people text-blue-600 dark:text-blue-400"></i>
      </div>
      <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {{ props.guests.length }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">Total Tamu</p>
    </div>

    <div
      class="text-center p-4 bg-white dark:bg-dark rounded-3xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div
        class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 flex items-center justify-center"
      >
        <i class="bi bi-check-circle text-green-600 dark:text-green-400"></i>
      </div>
      <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {{
          props.guests.filter((guest) => {
            guest.attendance_status == "attending";
          }).length
        }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">Hadir</p>
    </div>

    <div
      class="text-center p-4 bg-white dark:bg-dark rounded-3xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div
        class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 flex items-center justify-center"
      >
        <i class="bi bi-x-circle text-red-600 dark:text-red-400"></i>
      </div>
      <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {{
          props.guests.filter((guest) => {
            guest.attendance_status == "not_attending";
          }).length
        }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">Tidak Hadir</p>
    </div>

    <div
      class="text-center p-4 bg-white dark:bg-dark rounded-3xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div
        class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center"
      >
        <i class="bi bi-hourglass-split text-amber-600 dark:text-amber-400"></i>
      </div>
      <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {{
          props.guests.filter((guest) => {
            guest.attendance_status == "not_attending";
          }).length
        }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400">Pending</p>
    </div>
  </div>
</template>
