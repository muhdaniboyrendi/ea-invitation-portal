<template>
  <div
    class="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 lg:p-8 shadow-xl overflow-hidden"
  >
    <!-- Background Pattern -->
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"
    ></div>

    <div class="relative z-10 text-center">
      <h2 class="text-white font-bold text-2xl mb-3">
        Siap Membuat Undangan Impian?
      </h2>
      <p class="text-white/90 text-base mb-6 max-w-2xl mx-auto">
        Bergabunglah dengan ratusan klien yang telah mempercayakan momen spesial
        mereka kepada kami. Mari wujudkan undangan digital yang berkesan untuk
        acara Anda!
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/contact"
          class="bg-white text-purple-500 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition duration-300 hover:scale-105"
        >
          <i class="bi bi-telephone mr-2"></i>
          Hubungi Kami
        </NuxtLink>
        <NuxtLink
          to="/invitation/create"
          class="border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-purple-500 transition duration-300 hover:scale-105"
        >
          <i class="bi bi-eye mr-2"></i>
          Buat Undangan
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
