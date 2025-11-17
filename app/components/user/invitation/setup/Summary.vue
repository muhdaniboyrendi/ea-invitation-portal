<script setup>
const config = useRuntimeConfig();

const mainAppUrl = config.public.mainAppUrl;

const props = defineProps({
  invitationData: {
    type: Object,
    required: false,
  },
  themeData: {
    type: Object,
    required: false,
  },
  isSubmitting: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["reset", "submit"]);

const handleSubmit = () => {
  emit("submit");
};

const handleReset = () => {
  emit("reset");
};
</script>

<template>
  <div>
    <div class="mx-auto mt-10">
      <!-- Header Section -->
      <div class="text-center mb-6 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl shadow-lg mb-4"
        >
          <i class="bi bi-check-circle-fill text-white text-3xl"></i>
        </div>
        <h2
          class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
        >
          Hampir Selesai!
        </h2>
        <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base">
          Periksa kembali detail undangan Anda
        </p>
      </div>

      <!-- Summary Cards -->
      <div class="space-y-6 mb-6">
        <!-- Couple Card -->
        <div
          class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-sky-500 to-sky-600 p-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <i class="bi bi-heart-fill text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-white font-semibold text-lg">Nama Pasangan</h3>
                <p class="text-sky-100 text-xs">Mempelai Pria & Wanita</p>
              </div>
            </div>
          </div>
          <div class="p-5">
            <div
              class="flex flex-col sm:flex-row justify-center gap-4 text-center"
            >
              <p
                class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed"
              >
                {{ invitationData.groom_name || "-" }}
              </p>
              <div class="flex items-center justify-center gap-3 my-3">
                <div
                  class="h-px w-12 bg-gradient-to-r from-transparent to-sky-300"
                ></div>
                <i class="bi bi-heart-fill text-sky-500 text-lg"></i>
                <div
                  class="h-px w-12 bg-gradient-to-l from-transparent to-sky-300"
                ></div>
              </div>
              <p
                class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed"
              >
                {{ invitationData.bride_name || "-" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Theme Card -->
        <div
          class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-sky-600 to-sky-600 p-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <i class="bi bi-palette-fill text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-white font-semibold text-lg">Tema Undangan</h3>
                <p class="text-blue-100 text-xs">Desain pilihan Anda</p>
              </div>
            </div>
          </div>
          <div class="p-5">
            <div v-if="props.themeData" class="space-y-4">
              <div class="flex items-center gap-4">
                <div v-if="props.themeData.thumbnail" class="flex-shrink-0">
                  <NuxtImg
                    :src="props.themeData.thumbnail_url"
                    :alt="props.themeData.name"
                    class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-3xl shadow-md border-2 border-slate-200 dark:border-slate-600"
                    width="96"
                    height="96"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate"
                  >
                    {{ props.themeData.name }}
                  </p>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="props.themeData.is_premium"
                      class="text-sm text-slate-500 dark:text-slate-400 mt-1 py-0.5 px-2 bg-yellow-100 dark:bg-yellow-900 rounded-full inline-flex items-center gap-1"
                    >
                      <i class="bi bi-patch-check-fill text-yellow-500"></i>
                      Premium
                    </span>
                    <span
                      class="text-sm text-slate-500 dark:text-slate-400 mt-1 py-0.5 px-2 bg-slate-100 dark:bg-slate-700 rounded-full inline-block"
                    >
                      {{ props.themeData.theme_category.name }}
                    </span>
                  </div>
                </div>
              </div>
              <a
                :href="`${mainAppUrl}/${props.themeData?.slug}` || '#'"
                target="_blank"
                class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition duration-300 flex items-center justify-center gap-2"
              >
                <i class="bi bi-eye-fill"></i>
                <span>Preview Tema</span>
                <i class="bi bi-box-arrow-up-right text-sm"></i>
              </a>
            </div>
            <div v-else class="text-center py-8">
              <i
                class="bi bi-image text-4xl text-slate-300 dark:text-slate-600 mb-2"
              ></i>
              <p class="text-slate-400 dark:text-slate-500 italic">
                Tema belum dipilih
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-[1.02] active:scale-95 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
        >
          <span v-if="!isSubmitting" class="flex items-center gap-3">
            <i class="bi bi-rocket-takeoff-fill text-xl"></i>
            Buat Undangan Sekarang
          </span>
          <span v-else class="flex items-center justify-center gap-3">
            <Spinner />
            Membuat Undangan...
          </span>
        </button>

        <button
          type="button"
          @click="handleReset"
          :disabled="isSubmitting"
          class="w-full px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
          <span>Ubah Data</span>
        </button>
      </div>

      <!-- Info Footer -->
      <div class="mt-6 text-center">
        <p
          class="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2"
        >
          <i class="bi bi-shield-check"></i>
          <span>Data Anda aman dan terenkripsi</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
