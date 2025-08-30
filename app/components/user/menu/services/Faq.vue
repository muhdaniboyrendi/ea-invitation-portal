<script setup>
const faqOpen = ref(null);

const toggleFaq = (index) => {
  faqOpen.value = faqOpen.value === index ? null : index;
};
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div class="w-full flex items-center gap-4 mb-8">
      <div
        class="h-10 aspect-square rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 flex justify-center items-center"
      >
        <i class="bi bi-question-circle text-white text-lg"></i>
      </div>
      <h2 class="text-dark dark:text-white font-bold text-xl">
        Pertanyaan Umum
      </h2>
    </div>

    <div class="space-y-4">
      <!-- FAQ Item 1 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleFaq(1)"
        >
          <h4 class="text-dark dark:text-white font-semibold">
            Berapa lama waktu pengerjaan undangan?
          </h4>
          <i
            class="bi bi-chevron-down text-gray-400 transition duration-300"
            :class="{ 'rotate-180': faqOpen === 1 }"
          ></i>
        </div>
        <div
          v-show="faqOpen === 1"
          class="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30"
        >
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Waktu pengerjaan normal adalah 2-3 hari kerja setelah brief lengkap
            diterima. Untuk paket custom atau rush order, waktu dapat
            disesuaikan dengan kebutuhan Anda.
          </p>
        </div>
      </div>

      <!-- FAQ Item 2 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleFaq(2)"
        >
          <h4 class="text-dark dark:text-white font-semibold">
            Apakah bisa request revisi setelah undangan jadi?
          </h4>
          <i
            class="bi bi-chevron-down text-gray-400 transition duration-300"
            :class="{ 'rotate-180': faqOpen === 2 }"
          ></i>
        </div>
        <div
          v-show="faqOpen === 2"
          class="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30"
        >
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Ya, setiap paket sudah termasuk revisi gratis. Paket Basic (2x),
            Premium (unlimited), dan Deluxe (unlimited). Revisi tambahan
            dikenakan biaya sesuai tingkat kesulitan.
          </p>
        </div>
      </div>

      <!-- FAQ Item 3 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleFaq(3)"
        >
          <h4 class="text-dark dark:text-white font-semibold">
            Bagaimana cara pembayaran?
          </h4>
          <i
            class="bi bi-chevron-down text-gray-400 transition duration-300"
            :class="{ 'rotate-180': faqOpen === 3 }"
          ></i>
        </div>
        <div
          v-show="faqOpen === 3"
          class="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30"
        >
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Pembayaran dapat dilakukan via transfer bank, e-wallet (OVO, GoPay,
            DANA), atau QRIS. Pembayaran 50% di awal, 50% setelah approval final
            design.
          </p>
        </div>
      </div>

      <!-- FAQ Item 4 -->
      <div
        class="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleFaq(4)"
        >
          <h4 class="text-dark dark:text-white font-semibold">
            Apakah undangan bisa diakses selamanya?
          </h4>
          <i
            class="bi bi-chevron-down text-gray-400 transition duration-300"
            :class="{ 'rotate-180': faqOpen === 4 }"
          ></i>
        </div>
        <div
          v-show="faqOpen === 4"
          class="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30"
        >
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Ya, undangan akan aktif selamanya dan dapat diakses kapan saja. Kami
            juga menyediakan backup dan maintenance server untuk memastikan
            undangan selalu dapat diakses.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
