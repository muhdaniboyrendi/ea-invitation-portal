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
      :title="props.themeId ? 'Edit Musik' : 'Tambah Musik Baru'"
      :subtitle="
        props.themeId ? 'Edit musik yang sudah ada' : 'Buat musik undangan anda'
      "
      button-text="Kembali"
      button-link="/musics"
      icon="bi-music-note-list"
    />

    <ThemesCreateForm :theme-id="themeId" />
  </div>
</template>
