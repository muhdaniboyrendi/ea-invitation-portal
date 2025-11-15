<script setup>
defineProps(["user"]);
</script>

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
  >
    <div class="text-center">
      <!-- Avatar -->
      <div class="relative inline-block mb-4">
        <div
          class="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700"
        >
          <NuxtImg
            v-if="user.avatar"
            :src="user.avatar"
            alt="Avatar"
            width="96"
            height="96"
            class="w-full h-full object-cover"
          />
          <i v-else class="bi bi-person text-slate-400 text-5xl"></i>
        </div>
      </div>

      <!-- User Info -->
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
        {{ user.name }}
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
        {{ user.email }}
      </p>

      <!-- Member Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-sky-950 rounded-full border border-sky-200 dark:border-sky-800"
      >
        <i class="bi bi-award text-sky-500 text-sm"></i>
        <span class="text-xs font-medium text-slate-900 dark:text-slate-50">
          Member sejak {{ formatDateToIndonesian(user.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>
