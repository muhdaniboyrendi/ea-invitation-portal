<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="w-full flex items-center gap-4 mb-8">
      <div
        class="h-10 aspect-square rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex justify-center items-center"
      >
        <i class="bi bi-people-fill text-white text-lg"></i>
      </div>
      <h2 class="text-dark dark:text-white font-bold text-xl">Core Team</h2>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Creative Director -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <!-- Experience Badge -->
          <div
            class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
          >
            5Y
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-lg mb-1">
          Maya Sari
        </h3>
        <p class="text-orange-500 font-medium text-sm mb-2">
          Creative Director
        </p>
        <p
          class="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed"
        >
          Memimpin tim kreatif dengan keahlian visual design dan brand identity.
          Spesialis wedding invitation design.
        </p>
        <div class="flex justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-orange-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-instagram text-white text-xs"></i>
          </div>
          <div
            class="w-6 h-6 rounded bg-pink-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-dribbble text-white text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Senior Developer -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 p-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <div
            class="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full"
          >
            6Y
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-lg mb-1">
          Andi Pratama
        </h3>
        <p class="text-emerald-500 font-medium text-sm mb-2">
          Senior Developer
        </p>
        <p
          class="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed"
        >
          Full-stack developer dengan expertise React, Vue, dan Node.js. Fokus
          pada performance dan user experience.
        </p>
        <div class="flex justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-gray-800 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-github text-white text-xs"></i>
          </div>
          <div
            class="w-6 h-6 rounded bg-blue-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-linkedin text-white text-xs"></i>
          </div>
        </div>
      </div>

      <!-- UI/UX Designer -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 p-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <div
            class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-2 py-1 rounded-full"
          >
            4Y
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-lg mb-1">
          Lisa Anggraini
        </h3>
        <p class="text-pink-500 font-medium text-sm mb-2">UI/UX Designer</p>
        <p
          class="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed"
        >
          Specialist user interface dan user experience design. Ahli dalam
          creating intuitive dan engaging interfaces.
        </p>
        <div class="flex justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-purple-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-behance text-white text-xs"></i>
          </div>
          <div
            class="w-6 h-6 rounded bg-pink-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-dribbble text-white text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Motion Graphics Designer -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <div
            class="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full"
          >
            3Y
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-lg mb-1">
          Dimas Setiawan
        </h3>
        <p class="text-yellow-500 font-medium text-sm mb-2">Motion Designer</p>
        <p
          class="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed"
        >
          Expert dalam animasi dan motion graphics. Menciptakan pengalaman
          visual yang dinamis dan engaging.
        </p>
        <div class="flex justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-red-600 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-youtube text-white text-xs"></i>
          </div>
          <div
            class="w-6 h-6 rounded bg-blue-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-vimeo text-white text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Customer Success Manager -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <div
            class="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full"
          >
            4Y
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-lg mb-1">
          Rina Kartika
        </h3>
        <p class="text-indigo-500 font-medium text-sm mb-2">Customer Success</p>
        <p
          class="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed"
        >
          Memastikan kepuasan pelanggan dan memberikan support terbaik. Expert
          dalam client relationship management.
        </p>
        <div class="flex justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-green-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-whatsapp text-white text-xs"></i>
          </div>
          <div
            class="w-6 h-6 rounded bg-blue-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-linkedin text-white text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Quality Assurance -->
      <div class="group text-center">
        <div class="relative mb-6">
          <div
            class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300"
            >
              <i
                class="bi bi-person text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
          </div>
          <div
            class="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full"
          >
            3Y
          </div>
        </div>
        <h3 class="text-dark dark:text-white font-bold text-lg mb-1">
          Bayu Firmansyah
        </h3>
        <p class="text-cyan-500 font-medium text-sm mb-2">Quality Assurance</p>
        <p
          class="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed"
        >
          Memastikan setiap undangan digital memenuhi standar kualitas
          tertinggi. Testing dan quality control specialist.
        </p>
        <div class="flex justify-center gap-2">
          <div
            class="w-6 h-6 rounded bg-gray-800 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-github text-white text-xs"></i>
          </div>
          <div
            class="w-6 h-6 rounded bg-blue-500 flex items-center justify-center hover:scale-110 transition duration-300 cursor-pointer"
          >
            <i class="bi bi-linkedin text-white text-xs"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
