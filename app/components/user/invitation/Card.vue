<script setup>
const props = defineProps(["invitation"]);
</script>

<template>
  <div
    class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
  >
    <!-- Card Content -->
    <div class="relative p-4 md:p-6">
      <!-- Header -->
      <div
        class="flex flex-col-reverse sm:flex-row items-center justify-between mb-6 gap-y-4"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg"
          >
            <i class="bi bi-heart-fill text-white text-xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50">
              {{ props.invitation.groom }} &
              {{ props.invitation.bride }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Wedding Invitation
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div
          :class="{
            'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200 dark:border-amber-700':
              props.invitation.status === 'draft',
            'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-200 dark:border-emerald-700':
              props.invitation.status === 'published',
            'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 border border-red-200 dark:border-red-700':
              props.invitation.status === 'expired',
          }"
          class="px-4 py-1 rounded-full"
        >
          <span
            :class="{
              'text-amber-700 dark:text-amber-300':
                props.invitation.status === 'draft',
              'text-emerald-700 dark:text-emerald-300':
                props.invitation.status === 'published',
              'text-red-700 dark:text-red-300':
                props.invitation.status === 'expired',
            }"
            class="text-sm font-semibold"
          >
            {{
              props.invitation.status === "draft"
                ? "Belum Aktif"
                : props.invitation.status === "published"
                ? "Aktif"
                : "Kadaluarsa"
            }}
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/40 flex items-center justify-center"
          >
            <i class="bi bi-people text-sky-500 dark:text-sky-400"></i>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {{ props.invitation.guests.length }}
          </p>
          <p class="text-xs text-slate-600 dark:text-slate-300">Total Tamu</p>
        </div>

        <div
          class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 flex items-center justify-center"
          >
            <i
              class="bi bi-check-circle text-emerald-500 dark:text-emerald-400"
            ></i>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {{
              props.invitation.guests.filter((guest) => {
                guest.attendance_status == "attending";
              }).length
            }}
          </p>
          <p class="text-xs text-slate-600 dark:text-slate-300">Hadir</p>
        </div>

        <div
          class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 flex items-center justify-center"
          >
            <i class="bi bi-x-circle text-red-500 dark:text-red-400"></i>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {{
              props.invitation.guests.filter((guest) => {
                guest.attendance_status == "not_attending";
              }).length
            }}
          </p>
          <p class="text-xs text-slate-600 dark:text-slate-300">Tidak Hadir</p>
        </div>
      </div>

      <!-- Dates Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 aspect-square bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex justify-center items-center"
            >
              <i class="bi bi-calendar-plus text-white"></i>
            </div>
            <div class="text-start">
              <p class="text-xs text-slate-600 dark:text-slate-300">Dibuat</p>
              <p
                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
              >
                {{ formatDateToIndonesian(props.invitation.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 aspect-square bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex justify-center items-center"
            >
              <i class="bi bi-calendar-x text-white"></i>
            </div>
            <div class="text-start">
              <p class="text-xs text-slate-600 dark:text-slate-300">
                Kadaluarsa
              </p>
              <p
                class="text-sm font-semibold text-slate-900 dark:text-slate-50"
              >
                {{ formatDateToIndonesian(props.invitation.expiry_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex flex-col sm:flex-row gap-4">
        <NuxtLink
          :to="`/invitation/${props.invitation.id}`"
          class="w-full p-3 flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105"
        >
          <i class="bi bi-list text-sm"></i>
          <span class="block">Detail</span>
        </NuxtLink>

        <NuxtLink
          :to="`/invitation/${props.invitation.id}/guests`"
          class="w-full p-3 flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
        >
          <i class="bi bi-people text-sm"></i>
          <span class="block">Tamu</span>
        </NuxtLink>

        <a
          v-if="props.invitation.slug"
          :href="`http://localhost:3000/${props.invitation.slug}`"
          target="_blank"
          class="w-full p-3 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
        >
          <i class="bi bi-box-arrow-up-right text-sm"></i>
          <span class="block">lihat</span>
        </a>
      </div>
    </div>
  </div>
</template>
