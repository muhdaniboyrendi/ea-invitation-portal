<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="w-full flex items-center gap-4 mb-8">
      <div
        class="h-10 aspect-square rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex justify-center items-center"
      >
        <i class="bi bi-person-plus text-white text-lg"></i>
      </div>
      <h2 class="text-dark dark:text-white font-bold text-xl">
        Bergabung dengan Tim Kami
      </h2>
    </div>

    <div class="text-center mb-8">
      <p
        class="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-3xl mx-auto"
      >
        Kami selalu mencari talenta-talenta terbaik untuk bergabung dengan
        keluarga EA Invitation. Jika Anda passionate dalam dunia digital
        creative dan ingin berkembang bersama tim profesional, kami terbuka
        untuk kandidat yang tepat.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Open Position 1 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:scale-105 transition duration-300"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center"
          >
            <i class="bi bi-code-slash text-white"></i>
          </div>
          <div>
            <h4 class="text-dark dark:text-white font-bold">
              Frontend Developer
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              Remote / Full-time
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Mencari frontend developer dengan expertise React/Vue.js dan passion
          untuk UI/UX yang exceptional.
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            class="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded"
            >React</span
          >
          <span
            class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs px-2 py-1 rounded"
            >Vue.js</span
          >
          <span
            class="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs px-2 py-1 rounded"
            >CSS</span
          >
        </div>
        <button
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-sm font-medium"
        >
          Apply Now
        </button>
      </div>

      <!-- Open Position 2 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:scale-105 transition duration-300"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"
          >
            <i class="bi bi-palette text-white"></i>
          </div>
          <div>
            <h4 class="text-dark dark:text-white font-bold">
              Graphic Designer
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              Hybrid / Full-time
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Designer kreatif untuk mengembangkan konsep visual yang fresh dan
          memorable untuk undangan digital.
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            class="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 text-xs px-2 py-1 rounded"
            >Adobe CC</span
          >
          <span
            class="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs px-2 py-1 rounded"
            >Figma</span
          >
          <span
            class="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs px-2 py-1 rounded"
            >Branding</span
          >
        </div>
        <button
          class="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300 text-sm font-medium"
        >
          Apply Now
        </button>
      </div>

      <!-- Open Position 3 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:scale-105 transition duration-300"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center"
          >
            <i class="bi bi-headset text-white"></i>
          </div>
          <div>
            <h4 class="text-dark dark:text-white font-bold">
              Customer Support
            </h4>
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              Remote / Part-time
            </p>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Support specialist untuk membantu client dengan excellent
          communication dan problem-solving skills.
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs px-2 py-1 rounded"
            >Communication</span
          >
          <span
            class="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded"
            >CRM</span
          >
          <span
            class="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs px-2 py-1 rounded"
            >Empathy</span
          >
        </div>
        <button
          class="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition duration-300 text-sm font-medium"
        >
          Apply Now
        </button>
      </div>
    </div>

    <div class="text-center">
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
        Tidak melihat posisi yang sesuai? Kirimkan CV Anda dan ceritakan
        bagaimana Anda bisa berkontribusi untuk tim kami.
      </p>
      <button
        class="bg-teal-500 text-white px-8 py-3 rounded-xl hover:bg-teal-600 transition duration-300 hover:scale-105 font-semibold"
      >
        <i class="bi bi-envelope mr-2"></i>
        Send Your Portfolio
      </button>
    </div>
  </div>
</template>
