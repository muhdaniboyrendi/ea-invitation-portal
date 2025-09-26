<script setup>
const props = defineProps({
  packageId: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<template>
  <div class="space-y-6">
    <Header
      :title="props.packageId ? 'Edit Paket' : 'Tambah Paket Baru'"
      :subtitle="
        props.packageId
          ? 'Edit paket undangan yang sudah ada'
          : 'Buat paket undangan dengan fitur dan harga yang menarik'
      "
      button-text="Kembali"
      button-link="/packages"
    />

    <PackageCreateForm :package-id="packageId" />
  </div>
</template>
