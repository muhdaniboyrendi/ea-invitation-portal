<script setup>
const { packages, pending, error } = storeToRefs(usePackageStore());

const packagesList = [
  {
    id: 1,
    name: "Economy",
    price: 100000.0,
    features: [
      "100 tamu undangan + grup",
      "4 foto galeri (max)",
      "Informasi acara",
      "Background musik (list)",
      "Timer countdown",
      "Maps lokasi",
      "Story",
      "RSVP",
      "Ucapan tamu",
      "1 bulan masa aktif",
    ],
  },
  {
    id: 2,
    name: "Premium",
    price: 150000.0,
    features: [
      "500 tamu undangan + grup",
      "10 foto galeri (max)",
      "1 video",
      "Informasi acara",
      "Background musik custom",
      "Timer countdown",
      "Maps lokasi",
      "Tambah ke kalender",
      "Story",
      "RSVP",
      "Ucapan tamu",
      "Kirim hadiah",
      "6 bulan masa aktif",
    ],
  },
  {
    id: 3,
    name: "Business",
    price: 250000.0,
    features: [
      "Unlimited tamu undangan + grup",
      "50 foto galeri (max)",
      "10 video (max)",
      "Informasi acara",
      "Background musik custom",
      "Timer countdown",
      "Maps lokasi",
      "Tambah ke kalender",
      "Story",
      "RSVP",
      "Ucapan tamu",
      "Kirim hadiah",
      "6 bulan masa aktif",
    ],
  },
];
</script>

<template>
  <div
    class="relative bg-white/80 dark:bg-dark/80 rounded-3xl p-4 sm:pt-8 md:p-8 md:pt-12 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <div v-if="packages" class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-x-6 gap-y-8">
      <UserPackageCard v-for="pkg in packages" :key="pkg.id" :package="pkg" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-x-6 gap-y-8">
      <UserPackageCard
        v-for="pkg in packagesList"
        :key="pkg.id"
        :package="pkg"
      />
    </div>
  </div>
</template>
