<script setup>
const quickLinks = [
  {
    title: "Paket Undangan",
    description: "Daftar paket undangan yang tersedia",
    icon: "bi-box-seam",
    iconBg: "bg-sky-500",
    buttonColor: "bg-sky-500 hover:bg-sky-600",
    shadowColor: "shadow-sky-500/25",
    to: "/packages",
    label: "Lihat Paket",
  },
  {
    title: "Galeri Tema",
    description: "Daftar tema yang tersedia",
    icon: "bi-palette2",
    iconBg: "bg-blue-500",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    shadowColor: "shadow-blue-500/25",
    to: "/themes",
    label: "Lihat Tema",
  },
  {
    title: "Latar Belakang Musik",
    description: "Daftar musik latar belakang undangan yang tersedia",
    icon: "bi-music-note-list",
    iconBg: "bg-emerald-500",
    buttonColor: "bg-emerald-500 hover:bg-emerald-600",
    shadowColor: "shadow-emerald-500/25",
    to: "/musics",
    label: "Lihat Musik",
  },
];
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6">
    <div
      v-for="link in quickLinks"
      :key="link.to"
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
    >
      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-3">
          <div
            :class="[link.iconBg]"
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i :class="link.icon" class="text-white text-lg"></i>
          </div>
          <h4 class="text-base font-semibold text-slate-900 dark:text-slate-50">
            {{ link.title }}
          </h4>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          {{ link.description }}
        </p>
      </div>

      <!-- Action Button -->
      <NuxtLink
        :to="link.to"
        :class="[link.buttonColor, link.shadowColor]"
        class="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-2xl text-white font-semibold shadow-lg transition-all active:scale-[0.98] w-fit"
      >
        <span>{{ link.label }}</span>
        <i class="bi bi-arrow-right"></i>
      </NuxtLink>
    </div>
  </div>
</template>
