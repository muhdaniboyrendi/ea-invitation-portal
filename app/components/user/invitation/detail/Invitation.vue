<script setup>
const config = useRuntimeConfig();
const mainAppUrl = config.public.mainAppUrl;

const props = defineProps(["invitationData"]);
</script>

<template>
  <div>
    <div
      class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
    >
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between mb-6 gap-y-6">
          <div class="flex items-center space-x-3 flex-1">
            <div
              class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <i class="bi bi-heart-fill text-white text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-600 dark:text-slate-300">
                The Wedding of
              </p>

              <!-- Display Mode -->
              <div class="flex items-center gap-2">
                <h3
                  class="text-xl font-bold text-slate-900 dark:text-slate-50 truncate"
                >
                  {{ props.invitationData.groom }} &
                  {{ props.invitationData.bride }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div
            :class="{
              'w-fit h-fit bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200 dark:border-amber-700':
                props.invitationData.status === 'draft',
              'w-fit h-fit bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-200 dark:border-emerald-700':
                props.invitationData.status === 'published',
              'w-fit h-fit bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 border border-red-200 dark:border-red-700':
                props.invitationData.status === 'expired',
            }"
            class="px-4 py-1 rounded-full flex-shrink-0"
          >
            <span
              :class="{
                'text-amber-700 dark:text-amber-300':
                  props.invitationData.status === 'draft',
                'text-emerald-700 dark:text-emerald-300':
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
            class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-8 w-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex justify-center items-center flex-shrink-0"
              >
                <i class="bi bi-calendar-plus text-white text-sm"></i>
              </div>
              <div class="text-start">
                <p class="text-xs text-slate-600 dark:text-slate-300">Dibuat</p>
                <p
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  {{ formatDateToIndonesian(props.invitationData.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-8 w-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex justify-center items-center flex-shrink-0"
              >
                <i class="bi bi-calendar-x text-white text-sm"></i>
              </div>
              <div class="text-start">
                <p class="text-xs text-slate-600 dark:text-slate-300">
                  Kadaluarsa
                </p>
                <p
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  {{ formatDateToIndonesian(props.invitationData.expiry_date) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
          <NuxtLink
            :to="`/invitation/fill/${props.invitationData.id}`"
            class="w-full py-3 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <i class="bi bi-pencil text-sm"></i>
            <span class="block">Edit Data</span>
          </NuxtLink>

          <a
            v-if="props.invitationData.slug"
            :href="`${mainAppUrl}/${props.invitationData.slug}`"
            target="_blank"
            class="w-full py-3 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <i class="bi bi-box-arrow-up-right text-sm"></i>
            <span class="block">Preview Undangan</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
