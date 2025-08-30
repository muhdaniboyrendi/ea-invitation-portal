<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="w-full flex items-center gap-4 mb-6">
      <div
        class="h-10 aspect-square rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 flex justify-center items-center"
      >
        <i class="bi bi-heart text-white text-lg"></i>
      </div>
      <h2 class="text-dark dark:text-white font-bold text-xl">
        Nilai-Nilai Kami
      </h2>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Quality -->
      <div class="group hover:scale-[1.02] transition duration-300">
        <div
          class="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
        >
          <div
            class="h-8 aspect-square rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex justify-center items-center mb-3"
          >
            <i class="bi bi-gem text-white text-sm"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold mb-2">Kualitas</h4>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Komitmen terhadap standar kualitas tinggi dalam setiap desain dan
            layanan
          </p>
        </div>
      </div>

      <!-- Innovation -->
      <div class="group hover:scale-[1.02] transition duration-300">
        <div
          class="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
        >
          <div
            class="h-8 aspect-square rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center mb-3"
          >
            <i class="bi bi-lightbulb text-white text-sm"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold mb-2">Inovasi</h4>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Terus berinovasi menghadirkan fitur dan desain terdepan
          </p>
        </div>
      </div>

      <!-- Customer Focus -->
      <div class="group hover:scale-[1.02] transition duration-300">
        <div
          class="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
        >
          <div
            class="h-8 aspect-square rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex justify-center items-center mb-3"
          >
            <i class="bi bi-person-check text-white text-sm"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold mb-2">
            Fokus Pelanggan
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Mengutamakan kepuasan dan kebutuhan setiap klien kami
          </p>
        </div>
      </div>

      <!-- Sustainability -->
      <div class="group hover:scale-[1.02] transition duration-300">
        <div
          class="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
        >
          <div
            class="h-8 aspect-square rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex justify-center items-center mb-3"
          >
            <i class="bi bi-tree text-white text-sm"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold mb-2">
            Keberlanjutan
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Mendukung lingkungan dengan solusi digital ramah bumi
          </p>
        </div>
      </div>

      <!-- Excellence -->
      <div class="group hover:scale-[1.02] transition duration-300">
        <div
          class="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
        >
          <div
            class="h-8 aspect-square rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center mb-3"
          >
            <i class="bi bi-award text-white text-sm"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold mb-2">
            Keunggulan
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Berusaha memberikan hasil terbaik dalam setiap proyek
          </p>
        </div>
      </div>

      <!-- Trust -->
      <div class="group hover:scale-[1.02] transition duration-300">
        <div
          class="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
        >
          <div
            class="h-8 aspect-square rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex justify-center items-center mb-3"
          >
            <i class="bi bi-shield-check text-white text-sm"></i>
          </div>
          <h4 class="text-dark dark:text-white font-semibold mb-2">
            Kepercayaan
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-xs">
            Membangun hubungan jangka panjang berdasarkan kepercayaan
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
