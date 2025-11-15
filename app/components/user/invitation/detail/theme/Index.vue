<!-- UserInvitationDetailTheme -->
<script setup>
const config = useRuntimeConfig();

const mainAppUrl = config.public.mainAppUrl;

const props = defineProps(["invitationData"]);
</script>

<template>
  <div
    class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
  >
    <div class="relative p-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div
          class="h-12 w-12 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 flex justify-center items-center shadow-lg"
        >
          <i class="bi bi-palette-fill text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Tema Undangan
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Desain dan tampilan undangan Anda
          </p>
        </div>
      </div>

      <!-- Theme Details -->
      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100/50 dark:border-slate-700/50"
        >
          <span class="text-sm text-slate-600 dark:text-slate-300"
            >Nama Tema</span
          >
          <span class="font-semibold text-slate-900 dark:text-slate-50">{{
            props.invitationData.theme?.name
          }}</span>
        </div>

        <div
          class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100/50 dark:border-slate-700/50"
        >
          <span class="text-sm text-slate-600 dark:text-slate-300"
            >Status Tema</span
          >
          <span class="font-semibold text-slate-900 dark:text-slate-50">{{
            props.invitationData.theme?.is_premium ? "Premuim" : "Basic"
          }}</span>
        </div>

        <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
          <a
            :href="`${mainAppUrl}/${props.invitationData.theme?.slug}`"
            target="_blank"
            class="w-full text-center py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white transition-all duration-300 group/link shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span class="font-semibold">Preview Tema</span>
            <i
              class="bi bi-box-arrow-up-right ml-2 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300"
            ></i>
          </a>
          <NuxtLink
            :to="`/invitation/${props.invitationData.id}/themes`"
            class="w-full text-center py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white transition-all duration-300 group/link shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span class="font-semibold">Ubah Tema</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
