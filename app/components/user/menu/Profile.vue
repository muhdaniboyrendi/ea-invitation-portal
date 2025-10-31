<template>
  <div class="px-4 md:px-6">
    <div
      class="relative bg-white dark:bg-slate-900 rounded-3xl p-4 lg:p-6 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <div>
        <div class="w-full flex items-center gap-4 mb-6">
          <div
            class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 flex justify-center items-center"
          >
            <i class="bi bi-person-badge text-sky-500 text-2xl"></i>
          </div>
          <h4
            class="text-slate-900 dark:text-slate-50 font-bold text-lg md:text-xl"
          >
            Tentang EA Invitation
          </h4>
        </div>
        <p class="text-slate-600 dark:text-slate-300 text-sm mb-6">
          Kenali lebih dekat tentang kami, layanan, tim, dan cara menghubungi
          kami.
        </p>
      </div>

      <!-- Menu List -->
      <div class="space-y-3">
        <!-- Tentang Kami -->
        <NuxtLink
          to="/about"
          class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex justify-center items-center flex-shrink-0"
          >
            <i class="bi bi-person-circle text-sky-500 text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h5
              class="text-slate-900 dark:text-slate-50 font-semibold text-sm mb-1"
            >
              Tentang Kami
            </h5>
            <p class="text-slate-600 dark:text-slate-300 text-xs">
              Pelajari lebih lanjut tentang perjalanan dan visi kami
            </p>
          </div>
          <i
            class="bi bi-chevron-right text-slate-400 dark:text-slate-500 group-hover:text-sky-500 group-hover:translate-x-1 transition-all flex-shrink-0"
          ></i>
        </NuxtLink>

        <!-- Layanan Kami -->
        <NuxtLink
          to="/services"
          class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex justify-center items-center flex-shrink-0"
          >
            <i class="bi bi-gear text-sky-500 text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h5
              class="text-slate-900 dark:text-slate-50 font-semibold text-sm mb-1"
            >
              Layanan Kami
            </h5>
            <p class="text-slate-600 dark:text-slate-300 text-xs">
              Berbagai layanan profesional untuk undangan digital
            </p>
          </div>
          <i
            class="bi bi-chevron-right text-slate-400 dark:text-slate-500 group-hover:text-sky-500 group-hover:translate-x-1 transition-all flex-shrink-0"
          ></i>
        </NuxtLink>

        <!-- Tim Profesional -->
        <NuxtLink
          to="/team"
          class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex justify-center items-center flex-shrink-0"
          >
            <i class="bi bi-people text-sky-500 text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h5
              class="text-slate-900 dark:text-slate-50 font-semibold text-sm mb-1"
            >
              Tim Profesional
            </h5>
            <p class="text-slate-600 dark:text-slate-300 text-xs">
              Kenali tim kreatif dan berpengalaman kami
            </p>
          </div>
          <i
            class="bi bi-chevron-right text-slate-400 dark:text-slate-500 group-hover:text-sky-500 group-hover:translate-x-1 transition-all flex-shrink-0"
          ></i>
        </NuxtLink>

        <!-- Kontak & Dukungan -->
        <NuxtLink
          to="/contact"
          class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex justify-center items-center flex-shrink-0"
          >
            <i class="bi bi-telephone text-emerald-500 text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h5
              class="text-slate-900 dark:text-slate-50 font-semibold text-sm mb-1"
            >
              Kontak & Dukungan
            </h5>
            <p class="text-slate-600 dark:text-slate-300 text-xs">
              Hubungi kami untuk konsultasi gratis dan dukungan 24/7
            </p>
          </div>
          <i
            class="bi bi-chevron-right text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0"
          ></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
