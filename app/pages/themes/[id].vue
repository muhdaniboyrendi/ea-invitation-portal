<script setup>
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();

const id = route.params.id;
</script>

<template>
  <div class="bg-off-white dark:bg-dark">
    <NuxtLayout>
      <div class="flex flex-col gap-y-6">
        <ThemesCreate :theme-id="id" />
      </div>
    </NuxtLayout>
  </div>
</template>
