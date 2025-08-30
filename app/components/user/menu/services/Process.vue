<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-3 mb-4">
        <div
          class="h-10 aspect-square rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center"
        >
          <i class="bi bi-arrow-repeat text-white text-lg"></i>
        </div>
        <h2 class="text-dark dark:text-white font-bold text-xl">
          Alur Kerja Kami
        </h2>
      </div>
      <p class="text-gray-600 dark:text-gray-300 text-sm max-w-2xl mx-auto">
        Proses yang mudah dan transparan untuk menghadirkan undangan digital
        impian Anda
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Step 1 -->
      <div class="relative text-center group">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <span class="text-white font-bold text-xl">1</span>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">Konsultasi</h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Diskusikan kebutuhan dan konsep undangan Anda dengan tim kami
        </p>
        <!-- Arrow -->
        <div
          class="hidden lg:block absolute top-8 -right-3 text-gray-300 dark:text-gray-600"
        >
          <i class="bi bi-arrow-right text-xl"></i>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="relative text-center group">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <span class="text-white font-bold text-xl">2</span>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">Desain</h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Tim kreatif kami membuat desain sesuai dengan visi dan tema acara Anda
        </p>
        <!-- Arrow -->
        <div
          class="hidden lg:block absolute top-8 -right-3 text-gray-300 dark:text-gray-600"
        >
          <i class="bi bi-arrow-right text-xl"></i>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="relative text-center group">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <span class="text-white font-bold text-xl">3</span>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">Revisi</h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Review dan perbaikan hingga desain sesuai dengan keinginan Anda
        </p>
        <!-- Arrow -->
        <div
          class="hidden lg:block absolute top-8 -right-3 text-gray-300 dark:text-gray-600"
        >
          <i class="bi bi-arrow-right text-xl"></i>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="text-center group">
        <div
          class="h-16 aspect-square rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center mx-auto mb-4 group-hover:scale-110 transition duration-300"
        >
          <span class="text-white font-bold text-xl">4</span>
        </div>
        <h4 class="text-dark dark:text-white font-semibold mb-2">
          Serah Terima
        </h4>
        <p class="text-gray-600 dark:text-gray-300 text-xs">
          Undangan siap dibagikan dengan link dan panduan penggunaan lengkap
        </p>
      </div>
    </div>
  </div>
</template>
