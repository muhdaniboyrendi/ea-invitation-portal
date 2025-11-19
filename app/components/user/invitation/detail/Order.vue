<!-- UserInvitationDetailOrder -->
<script setup>
const props = defineProps(["invitationData"]);
</script>

<template>
  <div
    class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
  >
    <div class="relative p-4 md:p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div
          class="h-12 w-12 rounded-2xl bg-sky-500 flex justify-center items-center shadow-sm"
        >
          <i class="bi bi-box-seam-fill text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Paket & Pembayaran
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Detail paket dan status pembayaran
          </p>
        </div>
      </div>

      <!-- Payment Status Badge & Action -->
      <div
        class="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div
          :class="{
            'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800':
              props.invitationData.order?.payment_status === 'paid',
            'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800':
              props.invitationData.order?.payment_status === 'pending',
            'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800':
              props.invitationData.order?.payment_status !== 'paid' &&
              props.invitationData.order?.payment_status !== 'pending',
          }"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
        >
          <span
            :class="{
              'w-2 h-2 rounded-full bg-emerald-500 animate-pulse':
                props.invitationData.order?.payment_status === 'paid',
              'w-2 h-2 rounded-full bg-amber-500 animate-pulse':
                props.invitationData.order?.payment_status === 'pending',
              'w-2 h-2 rounded-full bg-red-500':
                props.invitationData.order?.payment_status !== 'paid' &&
                props.invitationData.order?.payment_status !== 'pending',
            }"
          ></span>
          <span
            :class="{
              'text-emerald-700 dark:text-emerald-300':
                props.invitationData.order?.payment_status === 'paid',
              'text-amber-700 dark:text-amber-300':
                props.invitationData.order?.payment_status === 'pending',
              'text-red-700 dark:text-red-300':
                props.invitationData.order?.payment_status !== 'paid' &&
                props.invitationData.order?.payment_status !== 'pending',
            }"
            class="text-sm font-semibold"
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

        <!-- <button
          class="py-3 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-sky-500/25 flex items-center gap-2"
        >
          <span>Tingkatkan Paket</span>
          <i class="bi bi-chevron-double-up"></i>
        </button> -->
      </div>

      <!-- Package Info -->
      <div
        class="mb-4 md:mb-6 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-xs font-medium text-sky-600 dark:text-sky-400 mb-1 uppercase tracking-wide"
            >
              Paket Aktif
            </p>
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50">
              {{ props.invitationData.order?.package?.name }}
            </h3>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-600 dark:text-slate-300 mb-1">
              Total Harga
            </p>
            <div class="text-2xl font-bold text-sky-500">
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
          class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Order ID
          </span>
          <span
            class="font-mono font-semibold text-slate-900 dark:text-slate-50 text-sm"
          >
            {{ props.invitationData.order?.order_id }}
          </span>
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Total Pembayaran
          </span>
          <span class="font-semibold text-slate-900 dark:text-slate-50">
            {{ formatRupiah(props.invitationData.order?.amount) }}
          </span>
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Metode Pembayaran
          </span>
          <span class="font-semibold text-slate-900 dark:text-slate-50">
            {{ props.invitationData.order?.payment_method || "-" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
