<script setup>
const props = defineProps(["invitationData"]);
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
  >
    <div class="relative p-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div
          class="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center shadow-lg"
        >
          <i class="bi bi-palette-fill text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Tema Undangan
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Desain dan tampilan undangan Anda
          </p>
        </div>
      </div>

      <!-- Theme Details -->
      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
        >
          <span class="text-sm text-gray-600 dark:text-gray-300"
            >Nama Tema</span
          >
          <span class="font-semibold text-gray-900 dark:text-white">{{
            props.invitationData.theme?.name
          }}</span>
        </div>

        <div
          class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
        >
          <span class="text-sm text-gray-600 dark:text-gray-300"
            >Status Tema</span
          >
          <span class="font-semibold text-gray-900 dark:text-white">{{
            props.invitationData.theme?.is_premium ? "Premuim" : "Basic"
          }}</span>
        </div>

        <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
          <a
            :href="props.invitationData.theme?.link"
            target="_blank"
            class="w-full text-center py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-all duration-300 group/link shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span class="font-semibold">Preview Tema</span>
            <i
              class="bi bi-box-arrow-up-right ml-2 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300"
            ></i>
          </a>
          <button
            type="button"
            class="w-full text-center py-3 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white transition-all duration-300 group/link shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span class="font-semibold">Ubah Tema</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
