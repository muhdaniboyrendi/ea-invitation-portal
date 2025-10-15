<script setup>
const props = defineProps(["invitation"]);
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
  >
    <!-- Card Content -->
    <div class="relative p-6">
      <!-- Header -->
      <div
        class="flex flex-col-reverse sm:flex-row items-center justify-between mb-6 gap-y-4"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <i class="bi bi-heart-fill text-white text-xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
              {{ props.invitation.groom }} & {{ props.invitation.bride }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Wedding Invitation
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div
          class="px-4 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-700"
        >
          <span
            class="text-sm font-semibold text-green-700 dark:text-green-300"
          >
            {{ props.invitation.status }}
          </span>
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
            {{ props.invitation.guests.length }}
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
              props.invitation.guests.filter((guest) => {
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
              props.invitation.guests.filter((guest) => {
                guest.attendance_status == "not_attending";
              }).length
            }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400">Tidak Hadir</p>
        </div>
      </div>

      <!-- Dates Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          class="p-3 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 aspect-square bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex justify-center items-center"
            >
              <i class="bi bi-calendar-plus text-white"></i>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600 dark:text-gray-400">Dibuat</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ formatDateToIndonesian(props.invitation.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="py-3 px-4 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 aspect-square bg-linear-to-r from-orange-500 to-amber-500 rounded-xl flex justify-center items-center"
            >
              <i class="bi bi-calendar-x text-white"></i>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600 dark:text-gray-400">Kadaluarsa</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ formatDateToIndonesian(props.invitation.expiry_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid gird-cols-1 sm:grid-cols-3 gap-3">
        <button
          class="p-3 flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
        >
          <i class="bi bi-eye text-sm"></i>
          <span class="block">Detail</span>
        </button>

        <button
          class="p-3 flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
        >
          <i class="bi bi-people text-sm"></i>
          <span class="block">Tamu</span>
        </button>

        <button
          class="p-3 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
        >
          <i class="bi bi-box-arrow-up-right text-sm"></i>
          <span class="block">lihat</span>
        </button>
      </div>
    </div>
  </div>
</template>
