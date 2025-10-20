<script setup>
const { user } = storeToRefs(useAuthStore());

const routelist = ref([
  {
    name: "beranda",
    label: "Beranda",
    path: "/",
    role: "user",
    icon: "bi-house-door",
  },
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    role: "admin",
    icon: "bi-graph-up-arrow",
  },
  {
    name: "paket",
    label: "Paket",
    path: "/packages",
    role: "admin",
    icon: "bi-box-seam",
  },
  {
    name: "tema",
    label: "Tema",
    path: "/themes",
    role: "admin",
    icon: "bi-palette2",
  },
  {
    name: "musik",
    label: "Musik",
    path: "/musics",
    role: "admin",
    icon: "bi-music-note-list",
  },
  {
    name: "undangan",
    label: "Undangan",
    path: "/invitation",
    role: "user",
    icon: "bi-envelope",
  },
  {
    name: "transaksi",
    label: "Transaksi",
    path: "/transaction",
    role: "user",
    icon: "bi-wallet2",
  },
  { name: "menu", label: "Menu", path: "/menu", role: "user", icon: "bi-list" },
]);
</script>

<template>
  <div>
    <!-- Desktop Sidebar Navigation -->
    <NavbarDesktopMode :user="user" :route-list="routelist" />

    <!-- Mobile Bottom Navigation -->
    <NavbarMobileMode :user="user" :route-list="routelist" />
  </div>
</template>
