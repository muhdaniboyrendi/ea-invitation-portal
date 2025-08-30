<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="w-full flex items-center gap-4 mb-8">
      <div
        class="h-10 aspect-square rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center"
      >
        <i class="bi bi-stars text-white text-lg"></i>
      </div>
      <h2 class="text-dark dark:text-white font-bold text-xl">
        Fitur Unggulan Layanan Kami
      </h2>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Responsive Design -->
      <div class="text-center group hover:scale-105 transition duration-300">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <i class="bi bi-phone text-white text-2xl"></i>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">
          Responsive Design
        </h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Tampil sempurna di semua perangkat, dari mobile hingga desktop
        </p>
      </div>

      <!-- Fast Loading -->
      <div class="text-center group hover:scale-105 transition duration-300">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <i class="bi bi-lightning text-white text-2xl"></i>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">
          Loading Cepat
        </h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Optimasi untuk loading super cepat dan pengalaman pengguna terbaik
        </p>
      </div>

      <!-- Easy Sharing -->
      <div class="text-center group hover:scale-105 transition duration-300">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <i class="bi bi-share text-white text-2xl"></i>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">
          Mudah Dibagikan
        </h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Share dengan sekali klik ke WhatsApp, Instagram, Facebook, dan email
        </p>
      </div>

      <!-- 24/7 Support -->
      <div class="text-center group hover:scale-105 transition duration-300">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <i class="bi bi-headset text-white text-2xl"></i>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">
          Support 24/7
        </h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Tim support siap membantu Anda kapan saja dengan respon cepat
        </p>
      </div>
    </div>
  </div>
</template>
