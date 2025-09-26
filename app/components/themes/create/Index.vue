<script setup>
const props = defineProps({
  themeId: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<template>
  <div class="space-y-6">
    <Header
      :title="props.themeId ? 'Edit Tema' : 'Tambah Tema Baru'"
      :subtitle="
        props.themeId ? 'Edit tema yang sudah ada' : 'Buat tema undangan anda'
      "
      button-text="Kembali"
      button-link="/themes"
    />

    <ThemesCreateForm :theme-id="themeId" />
  </div>
</template>
