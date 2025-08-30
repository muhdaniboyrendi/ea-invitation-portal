<template>
  <div class="space-y-6">
    <!-- Quick Contact -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30"
    >
      <div class="flex items-center gap-4 mb-6">
        <div
          class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex justify-center items-center"
        >
          <i class="bi bi-chat-dots text-white text-xl"></i>
        </div>
        <h3 class="text-xl font-bold text-dark dark:text-white">
          Kontak Cepat
        </h3>
      </div>

      <div class="space-y-4">
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          class="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark border border-green-200 dark:border-green-700/30 hover:bg-green-100 dark:hover:bg-green-900/40 hover:scale-[1.02] transition duration-300 group"
        >
          <div
            class="h-10 aspect-square rounded-xl bg-green-500 flex justify-center items-center"
          >
            <i class="bi bi-whatsapp text-white text-lg"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-dark dark:text-white">WhatsApp</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              +62 812 3456 7890
            </p>
          </div>
          <i
            class="bi bi-arrow-up-right text-green-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300"
          ></i>
        </a>

        <a
          href="tel:+6281234567890"
          class="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark border border-blue-200 dark:border-blue-700/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:scale-[1.02] transition duration-300 group"
        >
          <div
            class="h-10 aspect-square rounded-xl bg-blue-500 flex justify-center items-center"
          >
            <i class="bi bi-telephone text-white text-lg"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-dark dark:text-white">Telepon</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              +62 812 3456 7890
            </p>
          </div>
          <i
            class="bi bi-arrow-up-right text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300"
          ></i>
        </a>

        <a
          href="mailto:info@eainvitation.com"
          class="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark border border-purple-200 dark:border-purple-700/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:scale-[1.02] transition duration-300 group"
        >
          <div
            class="h-10 aspect-square rounded-xl bg-purple-500 flex justify-center items-center"
          >
            <i class="bi bi-envelope text-white text-lg"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-dark dark:text-white">Email</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              info@eainvitation.com
            </p>
          </div>
          <i
            class="bi bi-arrow-up-right text-purple-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300"
          ></i>
        </a>
      </div>
    </div>

    <!-- Office Location -->
    <div
      class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30"
    >
      <div class="flex items-center gap-4 mb-6">
        <div
          class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex justify-center items-center"
        >
          <i class="bi bi-geo-alt text-white text-xl"></i>
        </div>
        <h3 class="text-xl font-bold text-dark dark:text-white">
          Lokasi Kantor
        </h3>
      </div>

      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
          <h4 class="font-semibold text-dark dark:text-white mb-2">
            EA Invitation Studio
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
            Jl. Raya Karanganyar No. 123<br />
            Karanganyar, Jawa Tengah 57714<br />
            Indonesia
          </p>
          <div
            class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <i class="bi bi-clock"></i>
            <span>Senin - Sabtu: 08:00 - 17:00 WIB</span>
          </div>
        </div>

        <button
          class="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 rounded-2xl hover:from-red-600 hover:to-pink-600 hover:scale-[1.02] transition duration-300"
        >
          <i class="bi bi-map mr-2"></i>
          Lihat di Google Maps
        </button>
      </div>
    </div>
  </div>
</template>
