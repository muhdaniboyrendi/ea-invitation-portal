<script setup>
const props = defineProps(["invitationData"]);
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
  >
    <div class="relative p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between mb-6 gap-y-6">
        <div class="flex items-center space-x-3">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
          >
            <i class="bi bi-heart-fill text-white text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              The Wedding of
            </p>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
              {{ props.invitationData.groom }} &
              {{ props.invitationData.bride }}
            </h3>
          </div>
        </div>

        <!-- Status Badge -->
        <div
          :class="{
            'w-fit h-fit bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-700':
              props.invitationData.status === 'draft',
            'w-fit h-fit bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-700':
              props.invitationData.status === 'published',
            'w-fit h-fit bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 border border-red-200 dark:border-red-700':
              props.invitationData.status === 'expired',
          }"
          class="px-4 py-1 rounded-full"
        >
          <span
            :class="{
              'text-amber-700 dark:text-amber-300':
                props.invitationData.status === 'draft',
              'text-green-700 dark:text-green-300':
                props.invitationData.status === 'published',
              'text-red-700 dark:text-red-300':
                props.invitationData.status === 'expired',
            }"
            class="text-sm font-semibold"
          >
            {{
              props.invitationData.status === "draft"
                ? "Belum Aktif"
                : props.invitationData.status === "published"
                ? "Aktif"
                : "Kadaluarsa"
            }}
          </span>
        </div>
      </div>

      <!-- Dates Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          class="p-3 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex justify-center items-center"
            >
              <i class="bi bi-calendar-plus text-white text-sm"></i>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600 dark:text-gray-400">Dibuat</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ formatDateToIndonesian(props.invitationData.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="py-3 px-4 bg-white dark:bg-dark rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        >
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex justify-center items-center"
            >
              <i class="bi bi-calendar-x text-white text-sm"></i>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600 dark:text-gray-400">Kadaluarsa</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ formatDateToIndonesian(props.invitationData.expiry_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
        <button
          class="w-full py-3 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <i class="bi bi-pencil text-sm"></i>
          <span class="block">Edit Data</span>
        </button>

        <a
          v-if="props.invitationData.slug"
          :href="`http://localhost:3000/${props.invitationData.slug}`"
          target="_blank"
          class="w-full py-3 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <i class="bi bi-box-arrow-up-right text-sm"></i>
          <span class="block">Preview Undangan</span>
        </a>
      </div>
    </div>
  </div>
</template>
