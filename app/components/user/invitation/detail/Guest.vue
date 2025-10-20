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
        <div
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
        >
          {{ props.invitationData.guests?.length || 0 }} Tamu
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          !props.invitationData.guests ||
          props.invitationData.guests.length === 0
        "
        class="text-center py-16"
      >
        <div
          class="inline-flex h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4"
        >
          <i class="bi bi-person-plus text-4xl text-gray-400"></i>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-lg mb-2 font-semibold">
          Belum ada tamu undangan
        </p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mb-6">
          Tambahkan tamu untuk memulai mengirim undangan
        </p>
        <button
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <i class="bi bi-plus-circle mr-2"></i>
          Tambah Tamu
        </button>
      </div>

      <!-- Guest List -->
      <div v-else class="space-y-4">
        <div
          v-for="guest in props.invitationData.guests"
          :key="guest.id"
          class="p-4 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
              >
                {{ guest.name?.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ guest.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ guest.phone || "Tidak ada nomor telepon" }}
                </p>
              </div>
            </div>
            <div
              :class="{
                'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-700':
                  guest.attendance_status === 'attending',
                'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 border border-red-200 dark:border-red-700':
                  guest.attendance_status === 'not_attending',
                'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/40 dark:to-slate-900/40 border border-gray-200 dark:border-gray-700':
                  !guest.attendance_status ||
                  guest.attendance_status === 'pending',
              }"
              class="px-3 py-1 rounded-full"
            >
              <span
                :class="{
                  'text-green-700 dark:text-green-300':
                    guest.attendance_status === 'attending',
                  'text-red-700 dark:text-red-300':
                    guest.attendance_status === 'not_attending',
                  'text-gray-700 dark:text-gray-300':
                    !guest.attendance_status ||
                    guest.attendance_status === 'pending',
                }"
                class="text-xs font-semibold"
              >
                {{
                  guest.attendance_status === "attending"
                    ? "Hadir"
                    : guest.attendance_status === "not_attending"
                    ? "Tidak Hadir"
                    : "Belum Konfirmasi"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
