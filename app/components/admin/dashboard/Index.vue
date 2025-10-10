<script setup>
// Mock data for statistics
const totalUsers = 1247;
const totalInvitations = 3456;
const totalRevenue = 127500000;
const websiteVisits = 89432;

// Data untuk statistik pengguna bulanan
const usersData = [
  { month: "Jan", users: 85, newUsers: 45 },
  { month: "Feb", users: 120, newUsers: 60 },
  { month: "Mar", users: 180, newUsers: 80 },
  { month: "Apr", users: 210, newUsers: 95 },
  { month: "May", users: 245, newUsers: 110 },
  { month: "Jun", users: 189, newUsers: 85 },
  { month: "Jul", users: 267, newUsers: 125 },
  { month: "Aug", users: 298, newUsers: 140 },
  { month: "Sep", users: 234, newUsers: 98 },
  { month: "Oct", users: 321, newUsers: 155 },
  { month: "Nov", users: 289, newUsers: 125 },
  { month: "Dec", users: 356, newUsers: 180 },
];

// Data untuk undangan bulanan
const invitationsData = [
  { month: "Jan", invitations: 234, completed: 198 },
  { month: "Feb", invitations: 289, completed: 245 },
  { month: "Mar", invitations: 456, completed: 398 },
  { month: "Apr", invitations: 378, completed: 321 },
  { month: "May", invitations: 512, completed: 467 },
  { month: "Jun", invitations: 445, completed: 389 },
  { month: "Jul", invitations: 623, completed: 578 },
  { month: "Aug", invitations: 567, completed: 498 },
  { month: "Sep", invitations: 489, completed: 434 },
  { month: "Oct", invitations: 678, completed: 612 },
  { month: "Nov", invitations: 598, completed: 523 },
  { month: "Dec", invitations: 745, completed: 689 },
];

// Data untuk revenue bulanan
const revenueData = [
  { month: "Jan", revenue: 8500000, expenses: 3200000 },
  { month: "Feb", revenue: 12300000, expenses: 4100000 },
  { month: "Mar", revenue: 15600000, expenses: 5200000 },
  { month: "Apr", revenue: 11200000, expenses: 3800000 },
  { month: "May", revenue: 18900000, expenses: 6100000 },
  { month: "Jun", revenue: 14500000, expenses: 4900000 },
  { month: "Jul", revenue: 21200000, expenses: 7200000 },
  { month: "Aug", revenue: 19800000, expenses: 6800000 },
  { month: "Sep", revenue: 16700000, expenses: 5600000 },
  { month: "Oct", revenue: 23400000, expenses: 7900000 },
  { month: "Nov", revenue: 20100000, expenses: 6700000 },
  { month: "Dec", revenue: 25600000, expenses: 8500000 },
];

// Data untuk kunjungan website
const visitsData = [
  { month: "Jan", visits: 5640, uniqueVisitors: 3240 },
  { month: "Feb", visits: 6780, uniqueVisitors: 4120 },
  { month: "Mar", visits: 8950, uniqueVisitors: 5230 },
  { month: "Apr", visits: 7340, uniqueVisitors: 4560 },
  { month: "May", visits: 9870, uniqueVisitors: 6120 },
  { month: "Jun", visits: 8450, uniqueVisitors: 5340 },
  { month: "Jul", visits: 11230, uniqueVisitors: 7120 },
  { month: "Aug", visits: 10560, uniqueVisitors: 6780 },
  { month: "Sep", visits: 9340, uniqueVisitors: 5980 },
  { month: "Oct", visits: 12450, uniqueVisitors: 8230 },
  { month: "Nov", visits: 11670, uniqueVisitors: 7560 },
  { month: "Dec", visits: 13240, uniqueVisitors: 8970 },
];

// Data untuk tema undangan
const themeStats = [
  {
    category: "Wedding",
    count: 1245,
    percentage: 45,
    color: "from-pink-500 to-rose-500",
  },
  {
    category: "Birthday",
    count: 678,
    percentage: 25,
    color: "from-purple-500 to-indigo-500",
  },
  {
    category: "Corporate",
    count: 432,
    percentage: 16,
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Anniversary",
    count: 267,
    percentage: 10,
    color: "from-amber-500 to-orange-500",
  },
  {
    category: "Other",
    count: 134,
    percentage: 4,
    color: "from-gray-500 to-slate-500",
  },
];

// Computed untuk max values (untuk scaling bars)
const maxUsers = computed(() => Math.max(...usersData.map((d) => d.users)));
const maxInvitations = computed(() =>
  Math.max(...invitationsData.map((d) => d.invitations))
);
const maxRevenue = computed(() =>
  Math.max(...revenueData.map((d) => Math.max(d.revenue, d.expenses)))
);
const maxVisits = computed(() => Math.max(...visitsData.map((d) => d.visits)));

// Formatters
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

const formatCompactCurrency = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}jt`;
  }
  return formatCurrency(value);
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1
          class="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Dashboard EA Invitation
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Pantau statistik dan performa bisnis undangan digital Anda
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Users Card -->
        <div
          class="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center shadow-lg"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-gray-900 dark:text-white font-bold text-3xl">
                  {{ formatNumber(totalUsers) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Pengguna
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-green-500 text-sm font-semibold flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                +12.5%
              </span>
              <span class="text-gray-500 dark:text-gray-400 text-sm"
                >dari bulan lalu</span
              >
            </div>
          </div>
        </div>

        <!-- Total Invitations Card -->
        <div
          class="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center shadow-lg"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-gray-900 dark:text-white font-bold text-3xl">
                  {{ formatNumber(totalInvitations) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Undangan
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-green-500 text-sm font-semibold flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                +8.3%
              </span>
              <span class="text-gray-500 dark:text-gray-400 text-sm"
                >dari bulan lalu</span
              >
            </div>
          </div>
        </div>

        <!-- Total Revenue Card -->
        <div
          class="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-full -mr-16 -mt-16"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="h-14 w-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex justify-center items-center shadow-lg"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-gray-900 dark:text-white font-bold text-2xl">
                  {{ formatCurrency(totalRevenue) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Pemasukan
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-green-500 text-sm font-semibold flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                +15.7%
              </span>
              <span class="text-gray-500 dark:text-gray-400 text-sm"
                >dari bulan lalu</span
              >
            </div>
          </div>
        </div>

        <!-- Website Visits Card -->
        <div
          class="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-16 -mt-16"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="h-14 w-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center shadow-lg"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-gray-900 dark:text-white font-bold text-3xl">
                  {{ formatNumber(websiteVisits) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Kunjungan Website
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-green-500 text-sm font-semibold flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                +6.8%
              </span>
              <span class="text-gray-500 dark:text-gray-400 text-sm"
                >dari bulan lalu</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Users Bar Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Statistik Pengguna Bulanan
            </h4>
          </div>

          <div class="space-y-3">
            <div v-for="(data, index) in usersData" :key="index" class="group">
              <div class="flex items-center justify-between mb-1">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-300"
                  >{{ data.month }}</span
                >
                <div class="flex gap-4">
                  <span
                    class="text-xs text-blue-600 dark:text-blue-400 font-semibold"
                    >{{ data.users }} total</span
                  >
                  <span
                    class="text-xs text-green-600 dark:text-green-400 font-semibold"
                    >{{ data.newUsers }} baru</span
                  >
                </div>
              </div>
              <div class="flex gap-1">
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: `${(data.users / maxUsers) * 100}%` }"
                  ></div>
                </div>
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: `${(data.newUsers / maxUsers) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invitations Bar Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Statistik Undangan Bulanan
            </h4>
          </div>

          <div class="space-y-3">
            <div v-for="(data, index) in invitationsData" :key="index">
              <div class="flex items-center justify-between mb-1">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-300"
                  >{{ data.month }}</span
                >
                <div class="flex gap-4">
                  <span
                    class="text-xs text-purple-600 dark:text-purple-400 font-semibold"
                    >{{ data.invitations }} dibuat</span
                  >
                  <span
                    class="text-xs text-amber-600 dark:text-amber-400 font-semibold"
                    >{{ data.completed }} selesai</span
                  >
                </div>
              </div>
              <div class="flex gap-1">
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{
                      width: `${(data.invitations / maxInvitations) * 100}%`,
                    }"
                  ></div>
                </div>
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{
                      width: `${(data.completed / maxInvitations) * 100}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue and Visits Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 w-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex justify-center items-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                ></path>
              </svg>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Pemasukan & Pengeluaran Bulanan
            </h4>
          </div>

          <div class="space-y-3">
            <div v-for="(data, index) in revenueData" :key="index">
              <div class="flex items-center justify-between mb-1">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-300"
                  >{{ data.month }}</span
                >
                <div class="flex gap-3">
                  <span
                    class="text-xs text-green-600 dark:text-green-400 font-semibold"
                    >{{ formatCompactCurrency(data.revenue) }}</span
                  >
                  <span
                    class="text-xs text-red-600 dark:text-red-400 font-semibold"
                    >{{ formatCompactCurrency(data.expenses) }}</span
                  >
                </div>
              </div>
              <div class="flex gap-1">
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: `${(data.revenue / maxRevenue) * 100}%` }"
                  ></div>
                </div>
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: `${(data.expenses / maxRevenue) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Website Visits Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center items-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Statistik Kunjungan Website
            </h4>
          </div>

          <div class="space-y-3">
            <div v-for="(data, index) in visitsData" :key="index">
              <div class="flex items-center justify-between mb-1">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-300"
                  >{{ data.month }}</span
                >
                <div class="flex gap-4">
                  <span
                    class="text-xs text-cyan-600 dark:text-cyan-400 font-semibold"
                    >{{ formatNumber(data.visits) }} total</span
                  >
                  <span
                    class="text-xs text-purple-600 dark:text-purple-400 font-semibold"
                    >{{ formatNumber(data.uniqueVisitors) }} unik</span
                  >
                </div>
              </div>
              <div class="flex gap-1">
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: `${(data.visits / maxVisits) * 100}%` }"
                  ></div>
                </div>
                <div
                  class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    :style="{
                      width: `${(data.uniqueVisitors / maxVisits) * 100}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Pie Chart Alternative - Circular Progress -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="h-12 w-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-center items-center"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  ></path>
                </svg>
              </div>
              <h4 class="text-gray-900 dark:text-white font-bold text-xl">
                Distribusi Tema
              </h4>
            </div>

            <!-- Donut Chart Alternative -->
            <div class="flex justify-center items-center mb-6">
              <div class="relative w-48 h-48">
                <!-- Background circle -->
                <svg class="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="20"
                    class="dark:stroke-gray-700"
                  ></circle>

                  <!-- Wedding segment (45%) -->
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient1)"
                    stroke-width="20"
                    stroke-dasharray="226 502"
                    stroke-dashoffset="0"
                    class="transition-all duration-1000 ease-out"
                  ></circle>

                  <!-- Birthday segment (25%) -->
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient2)"
                    stroke-width="20"
                    stroke-dasharray="125 502"
                    stroke-dashoffset="-226"
                    class="transition-all duration-1000 ease-out"
                  ></circle>

                  <!-- Corporate segment (16%) -->
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient3)"
                    stroke-width="20"
                    stroke-dasharray="80 502"
                    stroke-dashoffset="-351"
                    class="transition-all duration-1000 ease-out"
                  ></circle>

                  <!-- Anniversary segment (10%) -->
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient4)"
                    stroke-width="20"
                    stroke-dasharray="50 502"
                    stroke-dashoffset="-431"
                    class="transition-all duration-1000 ease-out"
                  ></circle>

                  <!-- Other segment (4%) -->
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient5)"
                    stroke-width="20"
                    stroke-dasharray="20 502"
                    stroke-dashoffset="-481"
                    class="transition-all duration-1000 ease-out"
                  ></circle>

                  <!-- Gradients -->
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #ec4899; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #f43f5e; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #a855f7; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #6366f1; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradient3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #3b82f6; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #06b6d4; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradient4"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #f59e0b; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #f97316; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradient5"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #6b7280; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #64748b; stop-opacity: 1"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                <!-- Center text -->
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{
                      formatNumber(
                        themeStats.reduce((sum, t) => sum + t.count, 0)
                      )
                    }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Total</p>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="space-y-2">
              <div
                v-for="(theme, index) in themeStats"
                :key="index"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div
                    :class="`w-3 h-3 rounded-full bg-gradient-to-r ${theme.color}`"
                  ></div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    theme.category
                  }}</span>
                </div>
                <span
                  class="text-sm font-semibold text-gray-900 dark:text-white"
                  >{{ theme.percentage }}%</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Statistics List -->
        <div class="lg:col-span-2">
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="h-12 w-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex justify-center items-center"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  ></path>
                </svg>
              </div>
              <h4 class="text-gray-900 dark:text-white font-bold text-xl">
                Detail Tema Undangan
              </h4>
            </div>

            <div class="space-y-4">
              <div
                v-for="(theme, index) in themeStats"
                :key="index"
                class="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-600/30 hover:shadow-md transition-all duration-300"
              >
                <div class="flex items-center gap-4 flex-1">
                  <div
                    :class="`h-12 w-12 rounded-xl bg-gradient-to-r ${theme.color} flex justify-center items-center shadow-lg`"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h5 class="text-gray-900 dark:text-white font-bold text-lg">
                      {{ theme.category }}
                    </h5>
                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                      {{ formatNumber(theme.count) }} undangan dibuat
                    </p>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <span
                    class="text-3xl font-bold text-gray-900 dark:text-white block mb-1"
                  >
                    {{ theme.percentage }}%
                  </span>
                  <div
                    class="w-24 bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden"
                  >
                    <div
                      :class="`h-full bg-gradient-to-r ${theme.color} rounded-full transition-all duration-1000 ease-out`"
                      :style="{ width: theme.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div
        class="mt-8 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <div class="flex items-center gap-4 mb-6">
          <div
            class="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex justify-center items-center"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h4 class="text-gray-900 dark:text-white font-bold text-xl">
            Aktivitas Terkini
          </h4>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                  ></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Pengguna Baru
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  +24
                </p>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Hari ini</p>
          </div>

          <div
            class="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  ></path>
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  ></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Undangan Dibuat
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  +67
                </p>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Hari ini</p>
          </div>

          <div
            class="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/50"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Pemasukan
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatCompactCurrency(3450000) }}
                </p>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Hari ini</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover {
  animation: slideIn 0.3s ease-out;
}
</style>
