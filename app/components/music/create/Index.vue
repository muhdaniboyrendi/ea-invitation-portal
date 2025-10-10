<script setup>
const props = defineProps({
  musicId: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<template>
  <div class="space-y-6">
    <Header
      :title="props.musicId ? 'Edit Musik' : 'Tambah Musik Baru'"
      :subtitle="
        props.musicId ? 'Edit musik yang sudah ada' : 'Buat musik undangan anda'
      "
      button-text="Kembali"
      button-link="/musics"
      icon="bi-music-note-list"
    />

    <MusicCreateForm :music-id="musicId" />
  </div>
</template>
