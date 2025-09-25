<script setup>
const { packages, pending, error } = storeToRefs(usePackageStore());

const deleteSuccess = ref(false);

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

const handlePackageDeleted = () => {
  deleteSuccess.value = true;

  setTimeout(() => {
    deleteSuccess.value = false;
  }, 5000);
};
</script>

<template>
  <div
    class="relative bg-off-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
  >
    <!-- Success Alert -->
    <Transition name="fade">
      <div
        v-if="deleteSuccess"
        class="w-full rounded-2xl p-6 bg-green-100 dark:bg-green-950 border border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 font-medium mb-12 flex items-center gap-3"
      >
        <i class="bi bi-check-circle-fill text-lg"></i>
        <p>Paket berhasil dihapus!</p>
      </div>
    </Transition>

    <div
      v-if="packages"
      class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-x-6 gap-y-8 mt-6"
    >
      <PackageCard
        v-for="pkg in packages"
        :key="pkg.id"
        :package="pkg"
        @deleted="handlePackageDeleted"
      />
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-x-6 gap-y-8 mt-6"
    >
      <PackageCard v-for="pkg in packagesList" :key="pkg.id" :package="pkg" />
    </div>
  </div>
</template>
