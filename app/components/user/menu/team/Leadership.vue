<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="w-full flex items-center gap-4 mb-8">
      <div
        class="h-10 aspect-square rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center"
      >
        <i class="bi bi-star text-white text-lg"></i>
      </div>
      <h2 class="text-dark dark:text-white font-bold text-xl">
        Leadership Team
      </h2>
    </div>

    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <!-- Founder/CEO -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-1"
          >
            <div
              class="w-full h-full rounded-3xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-6xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <!-- Status Badge -->
          <div
            class="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full"
          >
            CEO
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-xl mb-2">
          Ahmad Rahman
        </h3>
        <p class="text-purple-500 font-semibold mb-3">
          Chief Executive Officer
        </p>
        <p
          class="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed"
        >
          Visioner di balik EA Invitation dengan 8+ tahun pengalaman di industri
          digital creative. Memimpin inovasi dan strategi pengembangan produk.
        </p>
        <div class="flex justify-center gap-3">
          <div
            class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-linkedin text-white text-sm"></i>
          </div>
          <div
            class="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-envelope text-white text-sm"></i>
          </div>
        </div>
      </div>

      <!-- Co-Founder/CTO -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-1"
          >
            <div
              class="w-full h-full rounded-3xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-6xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <!-- Status Badge -->
          <div
            class="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full"
          >
            CTO
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-xl mb-2">
          Sarah Widya
        </h3>
        <p class="text-blue-500 font-semibold mb-3">Chief Technology Officer</p>
        <p
          class="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed"
        >
          Expert teknologi dengan spesialisasi web development dan UI/UX.
          Bertanggung jawab atas inovasi teknologi dan pengalaman pengguna.
        </p>
        <div class="flex justify-center gap-3">
          <div
            class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-linkedin text-white text-sm"></i>
          </div>
          <div
            class="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-envelope text-white text-sm"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
