<script setup lang="ts">
// Mock data for statistics
const totalUsers = 1247;
const totalInvitations = 3456;
const totalRevenue = 127500000; // dalam Rupiah
const websiteVisits = 89432;

// Data untuk chart pengguna bulanan
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

const usersCategories = {
  users: {
    name: "Total Pengguna",
    color: "#3b82f6",
  },
  newUsers: {
    name: "Pengguna Baru",
    color: "#10b981",
  },
};

// Data untuk chart undangan bulanan
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

const invitationsCategories = {
  invitations: {
    name: "Undangan Dibuat",
    color: "#8b5cf6",
  },
  completed: {
    name: "Undangan Selesai",
    color: "#f59e0b",
  },
};

// Data untuk chart revenue bulanan
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

const revenueCategories = {
  revenue: {
    name: "Pemasukan",
    color: "#10b981",
  },
  expenses: {
    name: "Pengeluaran",
    color: "#ef4444",
  },
};

// Data untuk chart tema undangan
const themeData = [
  { category: "Wedding", count: 1245, percentage: 45 },
  { category: "Birthday", count: 678, percentage: 25 },
  { category: "Corporate", count: 432, percentage: 16 },
  { category: "Anniversary", count: 267, percentage: 10 },
  { category: "Other", count: 134, percentage: 4 },
];

// Data untuk chart kunjungan website
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

const visitsCategories = {
  visits: {
    name: "Total Kunjungan",
    color: "#06b6d4",
  },
  uniqueVisitors: {
    name: "Pengunjung Unik",
    color: "#8b5cf6",
  },
};

const xFormatter = (i: number) => usersData[i]?.month || "";

// Formatter untuk mata uang Rupiah
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatter untuk angka
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center"
            >
              <i class="bi bi-people text-white text-2xl"></i>
            </div>
            <div>
              <h3 class="text-gray-900 dark:text-white font-bold text-2xl">
                {{ formatNumber(totalUsers) }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Total Pengguna
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-500 text-sm font-medium">+12.5%</span>
            <span class="text-gray-500 text-sm">dari bulan lalu</span>
          </div>
        </div>

        <!-- Total Invitations Card -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center"
            >
              <i class="bi bi-envelope-heart text-white text-2xl"></i>
            </div>
            <div>
              <h3 class="text-gray-900 dark:text-white font-bold text-2xl">
                {{ formatNumber(totalInvitations) }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Total Undangan
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-500 text-sm font-medium">+8.3%</span>
            <span class="text-gray-500 text-sm">dari bulan lalu</span>
          </div>
        </div>

        <!-- Total Revenue Card -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex justify-center items-center"
            >
              <i class="bi bi-currency-dollar text-white text-2xl"></i>
            </div>
            <div>
              <h3 class="text-gray-900 dark:text-white font-bold text-2xl">
                {{ formatCurrency(totalRevenue) }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Total Pemasukan
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-500 text-sm font-medium">+15.7%</span>
            <span class="text-gray-500 text-sm">dari bulan lalu</span>
          </div>
        </div>

        <!-- Website Visits Card -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex justify-center items-center"
            >
              <i class="bi bi-eye text-white text-2xl"></i>
            </div>
            <div>
              <h3 class="text-gray-900 dark:text-white font-bold text-2xl">
                {{ formatNumber(websiteVisits) }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Kunjungan Website
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-500 text-sm font-medium">+6.8%</span>
            <span class="text-gray-500 text-sm">dari bulan lalu</span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Users Chart -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center"
            >
              <i class="bi bi-graph-up text-white text-xl"></i>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Statistik Pengguna Bulanan
            </h4>
          </div>
          <LineChart
            :data="usersData"
            :categories="usersCategories"
            :height="300"
            :xFormatter="xFormatter"
            xLabel="Bulan"
            yLabel="Jumlah Pengguna"
          />
        </div>

        <!-- Invitations Chart -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center"
            >
              <i class="bi bi-envelope-check text-white text-xl"></i>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Statistik Undangan Bulanan
            </h4>
          </div>
          <LineChart
            :data="invitationsData"
            :categories="invitationsCategories"
            :height="300"
            :xFormatter="xFormatter"
            xLabel="Bulan"
            yLabel="Jumlah Undangan"
          />
          <!-- <BarChart
            :data="invitationsData"
            :categories="invitationsCategories"
            :height="300"
            :xFormatter="xFormatter"
            xLabel="Bulan"
            yLabel="Jumlah Undangan"
          /> -->
        </div>
      </div>

      <!-- Revenue and Visits Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex justify-center items-center"
            >
              <i class="bi bi-currency-exchange text-white text-xl"></i>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Pemasukan & Pengeluaran Bulanan
            </h4>
          </div>
          <AreaChart
            :data="revenueData"
            :categories="revenueCategories"
            :height="300"
            :xFormatter="xFormatter"
            xLabel="Bulan"
            yLabel="Rupiah (IDR)"
          />
        </div>

        <!-- Website Visits Chart -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center items-center"
            >
              <i class="bi bi-bar-chart text-white text-xl"></i>
            </div>
            <h4 class="text-gray-900 dark:text-white font-bold text-xl">
              Statistik Kunjungan Website
            </h4>
          </div>
          <LineChart
            :data="visitsData"
            :categories="visitsCategories"
            :height="300"
            :xFormatter="xFormatter"
            xLabel="Bulan"
            yLabel="Jumlah Kunjungan"
          />
        </div>
      </div>

      <!-- Theme Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Pie Chart untuk distribusi tema -->
        <div class="lg:col-span-1">
          <div
            class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-center items-center"
              >
                <i class="bi bi-pie-chart text-white text-xl"></i>
              </div>
              <h4 class="text-gray-900 dark:text-white font-bold text-xl">
                Distribusi Tema
              </h4>
            </div>
            <PieChart
              :data="themeData"
              :height="300"
              valueKey="count"
              categoryKey="category"
            />
          </div>
        </div>

        <!-- Theme Statistics List -->
        <div class="lg:col-span-2">
          <div
            class="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="h-12 aspect-square rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex justify-center items-center"
              >
                <i class="bi bi-palette text-white text-xl"></i>
              </div>
              <h4 class="text-gray-900 dark:text-white font-bold text-xl">
                Detail Tema Undangan
              </h4>
            </div>

            <div class="space-y-4">
              <div
                v-for="theme in themeData"
                :key="theme.category"
                class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/30 dark:border-gray-600/30"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-center items-center"
                  >
                    <i class="bi bi-heart text-white text-sm"></i>
                  </div>
                  <div>
                    <h5 class="text-gray-900 dark:text-white font-semibold">
                      {{ theme.category }}
                    </h5>
                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                      {{ formatNumber(theme.count) }} undangan
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <span
                    class="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {{ theme.percentage }}%
                  </span>
                  <div
                    class="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1"
                  >
                    <div
                      class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: theme.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles jika diperlukan */
</style>
