<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 lg:p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div>
      <div class="w-full flex items-center gap-4 mb-6">
        <div
          class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center"
        >
          <i class="bi bi-person-badge text-white text-2xl"></i>
        </div>
        <h4 class="text-dark dark:text-white font-bold text-xl">
          Tentang EA Invitation
        </h4>
      </div>
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-8">
        Kenali lebih dekat tentang kami, layanan, tim, dan cara menghubungi
        kami.
      </p>
    </div>

    <!-- Menu List -->
    <div class="space-y-4">
      <!-- Tentang Kami -->
      <NuxtLink
        to="/about"
        class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-[1.02] transition duration-300 group"
      >
        <div
          class="h-10 aspect-square rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center"
        >
          <i class="bi bi-person-circle text-white text-lg"></i>
        </div>
        <div class="flex-1">
          <h5 class="text-dark dark:text-white font-semibold mb-1">
            Tentang Kami
          </h5>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Pelajari lebih lanjut tentang perjalanan dan visi kami
          </p>
        </div>
        <i
          class="bi bi-arrow-right text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition duration-300"
        ></i>
      </NuxtLink>

      <!-- Layanan Kami -->
      <NuxtLink
        to="/services"
        class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-[1.02] transition duration-300 group"
      >
        <div
          class="h-10 aspect-square rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center"
        >
          <i class="bi bi-gear text-white text-lg"></i>
        </div>
        <div class="flex-1">
          <h5 class="text-dark dark:text-white font-semibold mb-1">
            Layanan Kami
          </h5>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Berbagai layanan profesional untuk undangan digital
          </p>
        </div>
        <i
          class="bi bi-arrow-right text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition duration-300"
        ></i>
      </NuxtLink>

      <!-- Tim Profesional -->
      <NuxtLink
        to="/team"
        class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-[1.02] transition duration-300 group"
      >
        <div
          class="h-10 aspect-square rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 flex justify-center items-center"
        >
          <i class="bi bi-people text-white text-lg"></i>
        </div>
        <div class="flex-1">
          <h5 class="text-dark dark:text-white font-semibold mb-1">
            Tim Profesional
          </h5>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Kenali tim kreatif dan berpengalaman kami
          </p>
        </div>
        <i
          class="bi bi-arrow-right text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition duration-300"
        ></i>
      </NuxtLink>

      <!-- Kontak & Dukungan -->
      <NuxtLink
        to="/contact"
        class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-[1.02] transition duration-300 group"
      >
        <div
          class="h-10 aspect-square rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex justify-center items-center"
        >
          <i class="bi bi-telephone text-white text-lg"></i>
        </div>
        <div class="flex-1">
          <h5 class="text-dark dark:text-white font-semibold mb-1">
            Kontak & Dukungan
          </h5>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Hubungi kami untuk konsultasi gratis dan dukungan 24/7
          </p>
        </div>
        <i
          class="bi bi-arrow-right text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition duration-300"
        ></i>
      </NuxtLink>
    </div>
  </div>
</template>
