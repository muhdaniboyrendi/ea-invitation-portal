<script setup>
const props = defineProps(["order"]);

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>

<template>
  <div
    class="relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
  >
    <!-- Card Content -->
    <div
      class="relative p-4 md:p-6 bg-off-white dark:bg-gray-900 rounded-3xl border border-dark/10 dark:border-white/10"
    >
      <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
        <!-- Transaction Info -->
        <div class="flex items-start space-x-4 flex-1">
          <!-- Transaction Icon -->
          <div class="relative flex-shrink-0">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 bg-linear-to-r from-blue-500 to-purple-500"
            >
              <i
                class="bi bi-box text-white text-xl transition-transform duration-300 group-hover:rotate-12"
              ></i>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <h3
                  class="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate"
                >
                  Paket {{ props.order?.package_name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ props.order?.payment_method }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p
            class="text-lg text-blue-600 dark:text-blue-400 font-bold transition-colors duration-300"
          >
            Rp {{ formatRupiah(props.order?.amount) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">IDR</p>
        </div>
      </div>
      <div class="flex items-center mt-4">
        <div class="flex items-center space-x-4">
          <!-- Date -->
          <div class="flex items-center space-x-2">
            <div
              class="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-300"
            >
              <i
                class="bi bi-calendar3 text-xs text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              ></i>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {{ formatRelativeDate(props.order.created_at) }}
            </span>
          </div>

          <!-- Time -->
          <div class="flex items-center space-x-2">
            <div
              class="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-300"
            >
              <i
                class="bi bi-clock text-xs text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              ></i>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {{ formatTimeToIndonesian(props.order.created_at) }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-end mt-4">
        <!-- Status Badge -->
        <div
          class="px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all duration-300"
          :class="props.order?.payment_status == 'pending' ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300'"
        >
          {{ props.order?.payment_status }}
        </div>
        <button
          class="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300"
        >
          Isi Undangan
          <i class="bi bi-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>
