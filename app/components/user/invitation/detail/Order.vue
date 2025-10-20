<!-- UserInvitationDetailOrder -->
<script setup>
const props = defineProps(["invitationData"]);
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
  >
    <div class="relative p-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div
          class="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center shadow-lg"
        >
          <i class="bi bi-box-seam-fill text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Paket & Pembayaran
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Detail paket dan status pembayaran
          </p>
        </div>
      </div>

      <!-- Payment Status Badge -->
      <div class="mb-6 flex justify-between items-center">
        <div
          :class="{
            'bg-gradient-to-r h-fit from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-700':
              props.invitationData.order?.payment_status === 'paid',
            'bg-gradient-to-r h-fit from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-700':
              props.invitationData.order?.payment_status === 'pending',
          }"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full"
        >
          <span
            :class="{
              'text-green-700 dark:text-green-300':
                props.invitationData.order?.payment_status === 'paid',
              'text-amber-700 dark:text-amber-300':
                props.invitationData.order?.payment_status === 'pending',
            }"
            class="text-sm font-semibold capitalize"
          >
            {{
              props.invitationData.order?.payment_status === "paid"
                ? "Dibayar"
                : props.invitationData.order?.payment_status === "pending"
                ? "Menunggu Pembayaran"
                : "Gagal"
            }}
          </span>
        </div>

        <button
          class="py-3 px-6 rounded-2xl bg-linear-to-r from-green-500 to-teal-500 text-white font-semibold hover:scale-105 active:scale-95 transition duration-300"
        >
          Tingkatkan Paket
          <i class="bi bi-chevron-double-up ml-2"></i>
        </button>
      </div>

      <!-- Package Info -->
      <div
        class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ props.invitationData.order?.package?.name }}
          </h3>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{
                formatRupiah(props.invitationData.order?.package?.final_price)
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
        >
          <span class="text-sm text-gray-600 dark:text-gray-300">Order ID</span>
          <span
            class="font-mono font-semibold text-gray-900 dark:text-white text-sm"
            >{{ props.invitationData.order?.order_id }}</span
          >
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
        >
          <span class="text-sm text-gray-600 dark:text-gray-300"
            >Total Pembayaran</span
          >
          <span class="font-semibold text-gray-900 dark:text-white">{{
            formatRupiah(props.invitationData.order?.amount)
          }}</span>
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark border border-gray-100/50 dark:border-gray-700/50"
        >
          <span class="text-sm text-gray-600 dark:text-gray-300"
            >Metode Pembayaran</span
          >
          <span class="font-semibold text-gray-900 dark:text-white">{{
            props.invitationData.order?.payment_method || "-"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
